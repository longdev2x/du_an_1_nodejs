const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikesSchema = new Schema(
    {
        type: { type: Number }, // 0: like
        date: {
            type: Date,
            default: Date.now,
            get: v => v.getTime(),
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Posts',
            required: true,
        },
    },
    {
        timestamps: false,
        toJSON: { getters: true, virtuals: true },
    }
);

const Likes = mongoose.model('Likes', LikesSchema);
module.exports = Likes;
