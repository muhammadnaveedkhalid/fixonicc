import Stripe from 'stripe';

/**
 * Create or retrieve a Stripe Customer and charge via PaymentIntent.
 * Saves customer (email, name, address) and payment in Stripe.
 * @param {Object} opts
 * @param {string} opts.paymentMethodId - Stripe PaymentMethod id from frontend
 * @param {number} opts.amount - Order total in dollars (e.g. 20.34)
 * @param {string} opts.customerEmail
 * @param {string} opts.customerName
 * @param {Object} opts.shippingAddress - { address, city, postalCode, country }
 * @returns {{ success: true, paymentIntentId: string } | { success: false, error: string }}
 */
export async function createCustomerAndCharge(opts) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || !opts.paymentMethodId) {
    return { success: false, error: 'Stripe not configured or missing payment method' };
  }

  const stripe = new Stripe(secretKey);
  const { paymentMethodId, amount, customerEmail, customerName, shippingAddress } = opts;

  try {
    // Ensure amount is in cents and valid
    const amountCents = Math.round(Number(amount) * 100);
    if (amountCents < 50) {
      return { success: false, error: 'Amount too small' };
    }

    // Create or retrieve customer by email
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName || undefined,
        address: shippingAddress
          ? {
              line1: shippingAddress.address,
              city: shippingAddress.city,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country,
            }
          : undefined,
      });
    }

    // Attach payment method to customer (so it's saved in Stripe)
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
      await stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    } catch (attachErr) {
      if (attachErr.code !== 'resource_already_attached' && !attachErr.message?.includes('already been attached')) {
        throw attachErr;
      }
    }

    // Create and confirm PaymentIntent so the charge appears in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethodId,
      confirm: true,
      payment_method_types: ['card'],
      metadata: {
        customer_email: customerEmail,
        customer_name: customerName || '',
      },
    });

    if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
      return { success: true, paymentIntentId: paymentIntent.id };
    }
    if (paymentIntent.status === 'requires_action') {
      return { success: false, error: 'Card requires additional authentication' };
    }
    return { success: false, error: paymentIntent.last_payment_error?.message || 'Payment failed' };
  } catch (err) {
    console.error('Stripe createCustomerAndCharge error:', err?.message || err);
    const message = err?.message || err?.raw?.message || 'Stripe error';
    return { success: false, error: message };
  }
}
