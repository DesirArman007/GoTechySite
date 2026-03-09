import About from '../models/About.js';

// @desc    Get About Us content
// @route   GET /api/about
// @access  Public
export const getAboutContent = async (req, res) => {
    try {
        // We only expect one document for "About Us"
        const about = await About.findOne();

        res.status(200).json({
            success: true,
            data: about || {}
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update/Create About Us content
// @route   POST /api/about
// @access  Private (Admin)
export const updateAboutContent = async (req, res) => {
    try {
        const { title, description, story, values, imageUrl } = req.body;

        // Upsert: update if found, create if not
        const about = await About.findOneAndUpdate(
            {},
            { title, description, story, values, imageUrl },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: "About Us updated",
            data: about
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
