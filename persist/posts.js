const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const CommentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    poster: { type: String, required: true },
    chirp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chirp",
        required: true,
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

const ChirpSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    poster: { type: String, required: true },
    message: { type: String, required: true },
    embeddedSong: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    likes: { type: Array, default: [] },
    comments: { type: [CommentSchema], required: false, default: [] },
});



UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    }
    catch (err) {
        next(err);
    }
}
);

const User = mongoose.model("User", UserSchema);
const Chirp = mongoose.model("Chirp", ChirpSchema);
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = {
    User,
    Chirp,
    Comment,
};
