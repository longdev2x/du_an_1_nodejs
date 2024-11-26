const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikesSchema = new Schema({
    type: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now,
        get: v => v.getTime() // Format date thành timestamp number như JsonFormat.Shape.NUMBER
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    }
}, {
    timestamps: false,
    toJSON: { 
        getters: true // Đảm bảo getter của date được áp dụng khi chuyển đổi sang JSON
    }
});

// Middleware để auto-populate các fields khi query
LikesSchema.pre(/^find/, function(next) {
    this.populate('user')
        .populate('post');
    next();
});

// Static method để tạo Like mới (tương đương constructor trong Java)
LikesSchema.statics.createLike = function(id, type, date, user, post) {
    return new this({
        _id: id,
        type,
        date,
        user,
        post
    });
};

const Likes = mongoose.model('Likes', LikesSchema);

module.exports = Likes;
