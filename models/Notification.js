const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String
    },
    body: {
        type: String
    },
    type: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: false,
    collection: 'tbl_notification' // Tương đương @Table name trong Java
});

// Middleware để auto-populate user khi query
NotificationSchema.pre(/^find/, function(next) {
    this.populate('user');
    next();
});

// Static method tương đương constructor trong Java
NotificationSchema.statics.createNotification = function(id, date, title, body, user, type) {
    return new this({
        _id: id,
        date,
        title,
        body,
        type,
        user
    });
};

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;