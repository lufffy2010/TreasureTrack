import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar:   { type: String, default: null },
    xp:       { type: Number, default: 0 }
});

// Always export mongoose model — no controllers, no res.json here
const User = mongoose.model("User", userSchema);

export default User;
