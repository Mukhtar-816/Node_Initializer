const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: [true, "User ID is required for a profile"],
        unique: true,
    },
    name: {
        type: String, 
        maxlength: [20, "Name cannot exceed 20 characters"],
        trim: true
    },
    avatar: {
        type: String, 
        trim: true, 
        default: process.env.LOCAL_AVATAR_URI || "default-avatar.png"
    },
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);