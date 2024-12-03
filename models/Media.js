const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const MediaSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            default: '',
        },
        filePath: {
            type: String,
            trim: true,
            default: '',
        },
        contentType: {
            type: String,
            trim: true,
            default: 'application/octet-stream',
        },
        contentSize: {
            type: Number,
            default: 0,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        postId: {
            type: mongoose.Types.ObjectId,
            ref: 'Posts',
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true, virtuals: true },
        toObject: { getters: true, virtuals: true },
    }
);

const Media = mongoose.model('Media', MediaSchema);
module.exports = Media;
