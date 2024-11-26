const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    content: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
        get: v => v.getTime() // Để format date thành timestamp number như JsonFormat.Shape.NUMBER
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    media: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Like'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true,
    toJSON: { 
        getters: true // Để đảm bảo getter của date được áp dụng khi chuyển đổi sang JSON
    }
});

// Virtually populate để lấy media, likes và comments
PostsSchema.virtual('mediaList', {
    ref: 'Media',
    localField: '_id',
    foreignField: 'post'
});

PostsSchema.virtual('likesList', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post'
});

PostsSchema.virtual('commentsList', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
});

// Đảm bảo virtuals được include khi chuyển đổi sang JSON
PostsSchema.set('toJSON', { virtuals: true });
PostsSchema.set('toObject', { virtuals: true });

// Static method để tạo Posts mới (tương đương constructor trong Java)
PostsSchema.statics.createPosts = function(id, content, date, user, media, likes, comments) {
    return new this({
        _id: id,
        content,
        date,
        user,
        media,
        likes,
        comments
    });
};

// Middleware để auto-populate các fields khi query
PostsSchema.pre(/^find/, function(next) {
    this.populate('user')
        .populate('media')
        .populate('likes')
        .populate('comments');
    next();
});

const Posts = mongoose.model('Posts', PostsSchema);

module.exports = Posts;