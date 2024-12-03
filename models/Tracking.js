const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrackingSchema = new Schema({
    content: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
});

// Static method để tạo Tracking mới
TrackingSchema.statics.createTracking = function(id, content, date, user) {
    return new this({
        _id: id,
        content,
        date,
        user
    });
};

// Đảm bảo populate user khi query và chỉ lấy các trường cần thiết
TrackingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'id displayName username email university year image'  // Chọn các trường cần thiết
    });
    next();
});

const Tracking = mongoose.model('Tracking', TrackingSchema);

module.exports = Tracking;
