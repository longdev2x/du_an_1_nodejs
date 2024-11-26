const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    content: {
        type: String
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
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
    }
}, {
    timestamps: false,
    collection: 'tbl_comments', // Đặt tên collection giống như @Table name trong Java
    toJSON: { 
        getters: true // Đảm bảo getter của date được áp dụng khi chuyển đổi sang JSON
    }
});

// Middleware để auto-populate các fields khi query
CommentsSchema.pre(/^find/, function(next) {
    this.populate('user')
        .populate('post');
    next();
});

// Static method để tạo Comment mới (tương đương constructor trong Java)
CommentsSchema.statics.createComment = function(id, content, post, date, user) {
    return new this({
        _id: id,
        content,
        post,
        date,
        user
    });
};

const Comments = mongoose.model('Comments', CommentsSchema);

module.exports = Comments;