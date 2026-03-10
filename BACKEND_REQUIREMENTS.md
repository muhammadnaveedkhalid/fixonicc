# Backend API Requirements (Fixonic Frontend)

The React app expects a backend at `VITE_API_BASE_URL`. Below are the endpoints and behaviors the frontend uses.

## Environment (Frontend)

Create `.env` in the project root (see `.env.example`):

- `VITE_API_BASE_URL` – e.g. `http://localhost:5000/api` (no trailing slash)
- `VITE_STRIPE_PUBLISHABLE_KEY` – (optional) Stripe publishable key for card checkout

---

## 1. Email verification

- **POST** `/auth/register`  
  - Body: `{ name, email, password, role }`  
  - On success with email verification: return `{ userId, requireVerification: true, message }` (no token).  
  - Frontend then redirects to `/verify-otp` with `state: { userId }`.

- **POST** `/auth/verify`  
  - Body: `{ userId, emailOtp }` (6-digit OTP).  
  - On success: return `{ token, name, email, role, _id, status }`.  
  - If user is vendor and needs admin approval: set `status: 'pending'` and optionally omit token or return token with status.

- **POST** `/auth/resend-otp`  
  - Body: `{ userId }`.  
  - Sends a new OTP email and returns `{ message }`.

- **POST** `/auth/login`  
  - If user exists but email not verified: respond with **403** and `{ requireVerification: true, userId, message }` so the frontend can redirect to `/verify-otp`.

---

## 2. Vendor approval

- **GET** `/auth/users?role=vendor&page&limit&search` (admin only, Bearer token).  
  - Return users with `status`: `pending` | `active` | `rejected`.

- **PUT** `/auth/users/:id` (admin only).  
  - Body can include `{ status: 'active' }` to approve vendor or `{ status: 'rejected', rejectionReason }` to reject.  
  - Frontend Vendor Management uses this to approve/reject.

- Login response must include `status` for vendors so the frontend can show “Pending approval” or “Rejected” and block dashboard access.

---

## 3. Accessories & orders

- **GET** `/accessories?category=Mobile|Laptop|Tablet`  
  - Return array of `{ _id, name, description, price, image, stock, category }`.  
  - If this fails or is missing, the frontend falls back to mock data.

- **POST** `/orders`  
  - Headers: `Authorization: Bearer <token>`.  
  - Body: `{ orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, paymentMethodId? }`.  
  - `paymentMethodId` is the Stripe PaymentMethod id when paying by card.

- **POST** `/orders/create-payment-intent` (optional, for Stripe).  
  - Body: `{ amount }` (cents), `{ paymentMethodId }`.  
  - Return `{ clientSecret }` for Stripe Confirm Card Payment.  
  - If this endpoint is not implemented, the frontend still sends `paymentMethodId` with the order; backend can create and confirm the PaymentIntent server-side.

---

## 4. Stripe (backend)

- Use Stripe SDK (Node) to create a PaymentIntent with the order amount.
- Either:  
  - Expose `POST /orders/create-payment-intent` and return `clientSecret`, and/or  
  - On `POST /orders`, accept `paymentMethodId`, create PaymentIntent, confirm, then create the order record.

---

## 5. Other endpoints used by the frontend

- **GET/PUT** `/auth/users/:id` – profile update, delete user  
- **GET** `/auth/profile/:id` – public profile  
- **GET** `/vendors`, **GET** `/vendors/:id` – vendor list and profile  
- **GET/POST/PUT/DELETE** `/repairs`, **PUT** `/repairs/:id/status` – repairs (admin/vendor)  
- **GET** `/repairs/stats` – admin overview stats  
- **GET/POST/PUT/DELETE** `/blogs`, **/reviews**, **/brands**, **/contact**, **/content/:pageName**  
- **POST** `/upload` – multipart upload, return URL

---

## 6. CORS

- Allow the frontend origin (e.g. `http://localhost:5173`) in CORS so all above requests succeed from the browser.
