import Brand from '../models/Brand.js';

export const getBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || '';

        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } }
            ];
        }

        const count = await Brand.countDocuments(query);
        const brands = await Brand.find(query)
            .limit(limit)
            .skip(limit * (page - 1))
            .sort({ name: 1 });

        res.status(200).json({
            brands,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const addBrand = async (req, res) => {
    const brand = req.body;
    const newBrand = new Brand(brand);
    try {
        await newBrand.save();
        res.status(201).json(newBrand);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteBrand = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "No id provided" });

    try {
        await Brand.findByIdAndDelete(id);
        res.json({ message: "Brand deleted successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
