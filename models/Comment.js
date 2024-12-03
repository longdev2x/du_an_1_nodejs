const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
    {
        content: { type: String },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Posts',
            required: true,
        },
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
    },
    {
        timestamps: false,
        toJSON: { getters: true, virtuals: true },
    }
);

const Comments = mongoose.model('Comments', CommentsSchema);
module.exports = Comments;
