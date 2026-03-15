import About from '../models/About.js';

/** GET /api/about — Returns the single About Us document. */
export const getAboutContent = async (req, res) => {
    try {
        // Only one About Us document exists in the collection
        const about = await About.findOne();

        res.status(200).json({
            success: true,
            data: about || {}
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/** POST /api/about — Admin: create or update the About Us page content. */
export const updateAboutContent = async (req, res) => {
    try {
        const { title, description, story, values, imageUrl } = req.body;


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
