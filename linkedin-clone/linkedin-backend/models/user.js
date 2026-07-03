const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    f_name: {
        type: String,
        default: ""
    },
    headline: {
        type: String,
        default: ""
    },
    curr_company: {
        type: String,
        default: ""
    },
    curr_location: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: "./Images/UserLogo.png"
    },
    cover_pic: {
        type: String,
        default: "./Images/Landscape.jfif"
    },
    about: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    experience: [
        {
            designation: {
                type: String,
            },
            company_name: {
                type: String,
            },
            duration: {
                type: String,
            },
            location: {
                type: String,
            }
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    pending_friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }
    ],
    resume: {
        type: String
    }
}, { timestamps: true });

const userModel = mongoose.model('user', UserSchema);
module.exports = userModel;