import { TeamMember } from '../models/TeamMember.js';
import { uploadOnCloudinary } from "../config/cloudinary.js";

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res) => {

    console.log(`[TeamController] ${req.method} ${req.originalUrl} called`);
    try {
        const team = await TeamMember.find().sort({ name: 1 });

        console.log("[TeamController] Fetched team members", team.length);

        res.status(200).json({
            success: true,
            message: "Team members fetched successfully",
            data: team
        });
    } catch (error) {
        console.error("[TeamController] Error while fetching team members", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch team members"
        });
    }
};

const addTeamMember = async (req, res) => {

    console.log(`[TeamController] ${req.method} ${req.originalUrl} called`);

    try {
        let avatarUrl = req.body.avatar;

        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (cloudinaryResponse) {
                avatarUrl = cloudinaryResponse.secure_url;
            }
        }

        const teamData = {
            ...req.body,
            avatar: avatarUrl
        };

        const member = await TeamMember.create(teamData);
        console.log(`[TeamController] Member created: ${member._id}`);

        res.status(201).json({
            success: true,
            message: 'Team member added',
            data: member
        });

    } catch (error) {
        console.error("[TeamController] Error while adding the team member", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to add team member"
        });
    }
};

const deleteTeamMember = async (req, res) => {
    console.log(`[TeamController] ${req.method} ${req.originalUrl} called`);
    try {
        const member = await TeamMember.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        console.log(`[TeamController] Member deleted: ${req.params.id}`);
        res.status(200).json({ success: true, message: 'Team member deleted' });
    } catch (error) {
        console.error('[TeamController] Error deleting team member', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete team member' });
    }
};

export { getTeamMembers, addTeamMember, deleteTeamMember };
