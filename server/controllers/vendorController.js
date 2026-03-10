import User from '../models/User.js';

// Helper function for distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// @desc    Get all vendors with optional location sorting
// @route   GET /api/vendors
// @access  Public
export const getVendors = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let query = { role: 'vendor', status: 'active' };

    let vendors = await User.find(query).select('-password');

    // If location is provided, sort by distance
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      vendors = vendors.map(vendor => {
        const vendorObj = vendor.toObject();
        if (vendor.location && vendor.location.coordinates && vendor.location.coordinates.lat && vendor.location.coordinates.lng) {
          const dist = calculateDistance(userLat, userLng, vendor.location.coordinates.lat, vendor.location.coordinates.lng);
          return { ...vendorObj, distance: dist };
        }
        return { ...vendorObj, distance: Infinity }; // Push to end if no location
      });

      vendors.sort((a, b) => a.distance - b.distance);
    }

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor by ID
// @route   GET /api/vendors/:id
// @access  Public
export const getVendorById = async (req, res) => {
    try {
        const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' }).select('-password');
        if (vendor) {
            res.json(vendor);
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
