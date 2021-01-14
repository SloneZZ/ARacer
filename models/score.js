const mongoose = require("mongoose");
const schema = mongoose.Schema;
const scoreSchema = new schema({
    score: {
        type: Number,
        required: true
    },
    playtime: {
        type: Number,
        required: true
    },
    user_email: {
        type: String,
        required: true
    }
});
module.exports = score = mongoose.model("scores", scoreSchema);