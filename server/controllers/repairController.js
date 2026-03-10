import Repair from '../models/Repair.js';
import User from '../models/User.js';
import { sendOrderConfirmation } from '../utils/notificationService.js';

export const getRepairs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';
        const status = req.query.status || 'All';

        let query = {};
        
        // Filter based on user role
        if (req.user && req.user.role === 'client') {
            query.customerId = req.user._id;
        } else if (req.user && req.user.role === 'vendor') {
             query.vendorId = req.user._id;
        }

        if (status && status !== 'All') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { id: { $regex: search, $options: 'i' } },
                { device: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { issue: { $regex: search, $options: 'i' } }
            ];
        }

        const count = await Repair.countDocuments(query);
        const repairs = await Repair.find(query)
            .populate('customerId', 'name')
            .populate('vendorId', 'name')
            .limit(limit)
            .skip(limit * (page - 1))
            .sort({ createdAt: -1 });

        res.status(200).json({
            repairs,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const addRepair = async (req, res) => {
    const repairData = req.body;
    // Set customerId from authenticated user if available
    if (req.user && !repairData.customerId) {
        repairData.customerId = req.user._id;
    }

    try {
        const newRepair = new Repair(repairData);
        await newRepair.save();

        // Send Order Confirmation
        try {
            const user = await User.findById(repairData.customerId);
            if (user) {
                await sendOrderConfirmation(user, newRepair);
            }
        } catch (emailError) {
            console.error("Failed to send order confirmation:", emailError);
            // Don't fail the request if email fails
        }

        res.status(201).json(newRepair);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateRepairStatus = async (req, res) => {
    const { id } = req.params;
    const { status, price } = req.body;
    
    try {
        const updateData = {};
        if (status) {
            updateData.status = status;
            updateData.$push = { history: status };
        }
        if (price !== undefined) {
            updateData.price = price;
        }
        if (req.body.proofImage) {
            updateData.proofImage = req.body.proofImage;
        }

        const updatedRepair = await Repair.findOneAndUpdate(
            { id: id }, // Using custom ID field
            updateData,
            { new: true }
        );
        res.status(200).json(updatedRepair);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteRepair = async (req, res) => {
    const { id } = req.params;
    try {
        await Repair.findOneAndDelete({ id: id }); // Using custom ID field
        res.json({ message: "Repair deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getStats = async (req, res) => {
    try {
        const query = {};
        if (req.user && req.user.role === 'vendor') {
            query.vendorId = req.user._id;
        } else if (req.user && req.user.role === 'client') {
            query.customerId = req.user._id;
        }

        const repairs = await Repair.find(query);

        // Common stats calculation
        const completedRepairs = repairs.filter(r => r.status === 'Completed' || r.status === 'Fixed');
        const totalRevenue = completedRepairs.reduce((acc, curr) => acc + (curr.price || 0), 0);
        
        // Monthly revenue calculation
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = months.map(month => ({ name: month, value: 0 }));
        
        // Populate monthly data (assuming date strings like "YYYY-MM-DD" or similar, or using createdAt)
        // Repair model uses 'date' string field "YYYY-MM-DD" mostly based on mock data, but let's check timestamps too
        completedRepairs.forEach(repair => {
            const date = new Date(repair.date || repair.createdAt);
            const monthIndex = date.getMonth(); // 0-11
            monthlyData[monthIndex].value += (repair.price || 0);
        });

        // Response based on role
        if (req.user.role === 'vendor') {
            const pendingJobs = repairs.filter(r => ['Pending', 'Accepted', 'On the Way', 'Ready'].includes(r.status)).length;
            const completedJobs = completedRepairs.length;
            
            res.status(200).json({
                totalEarnings: totalRevenue,
                completedJobs,
                pendingJobs,
                monthlyData,
                totalRepairs: repairs.length
            });
        } else if (req.user.role === 'client') {
            res.status(200).json({
                totalSpent: totalRevenue,
                totalRequests: repairs.length,
                completedRequests: completedRepairs.length
            });
        } else {
             // Admin Logic (Global)
             const allUsers = await User.find({});
             const clientCount = allUsers.filter(u => u.role === 'client').length;
             const vendorCount = allUsers.filter(u => u.role === 'vendor').length;
             const adminCount = allUsers.filter(u => u.role === 'admin').length;

             res.status(200).json({
                totalRevenue,
                successfulRepairs: completedRepairs.length,
                totalUsers: allUsers.length,
                totalVendors: vendorCount,
                clientCount,
                vendorCount,
                adminCount,
                monthlyData
             });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
