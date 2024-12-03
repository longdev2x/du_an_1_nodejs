const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const PostsSchema = new Schema(
    {
        content: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            default: Date.now,
            get: v => v.getTime(),
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users', // Kết nối đúng với schema `Users`
            required: true,
        },
        media: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Media',
            }
        ],
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Likes',
            }
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comments',
            }
        ],
    },
    {
        timestamps: true,
        toJSON: {
            getters: true,
            virtuals: true,
        },
        toObject: {
            getters: true,
            virtuals: true,
        },
    }
);

// Middleware auto-populate để đảm bảo chuẩn response
PostsSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'id displayName username email gender university year roles',
    })
        .populate({
            path: 'media',
            select: 'id contentType contentSize name filePath',
        })
        .populate({
            path: 'likes',
            select: 'id type date user',
            populate: {
                path: 'user',
                select: 'id username',
            },
        })
        .populate({
            path: 'comments',
            select: 'id content date user',
            populate: {
                path: 'user',
                select: 'id username',
            },
        });
    next();
});


// Static method để tạo mới bài post
PostsSchema.statics.create = function(data) {
    return new this(data);
};


// Middleware auto-populate khi query
PostsSchema.pre(/^find/, function(next) {
    this.populate('user')
        .populate({
            path: 'media',
            model: 'Media', // Kết nối với model Media
        })
        .populate('likes')
        .populate('comments');
    next();
});

// Sử dụng mongooseAggregatePaginate plugin
PostsSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.models.Posts || mongoose.model('Posts', PostsSchema);
