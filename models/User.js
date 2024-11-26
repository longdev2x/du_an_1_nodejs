const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 100
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        maxLength: 150
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    active: {
        type: Boolean,
        default: true,
    },
    gender: {
        type: String
    },
    university: {
        type: String
    },
    year: {
        type: Number // 1-5, 6-đã tốt nghiệp
    },
    countDayCheckin: {
        type: Number,
        default: 0
    },
    countDayTracking: {
        type: Number,
        default: 0
    },
    tokenDevice: {
        type: String
    },
    image: {
        type: String
    },
    dob: {
        type: Date,
        default: null
    },
    birthPlace: {
        type: String,
        default: null
    },
    hasPhoto: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

// Thêm các methods
UserSchema.methods = {
    getAuthorities: function() {
        return this.roles;
    },
    isEnabled: function() {
        return this.active;
    }
};

// Static methods for creating user instances
UserSchema.statics = {
    createFromBasicInfo: function(id, username, email, active) {
        return new this({
            _id: id,
            username,
            email,
            active
        });
    },
    
    createFromDetailedInfo: function(id, username, email, displayName, active) {
        return new this({
            _id: id,
            username,
            email,
            displayName,
            active
        });
    },
};

// Chỉ định cách trả về dữ liệu của người dùng
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    user.id = user._id;
    delete user._id;
    delete user.__v;
    delete user.password;  // Không trả về password
    return user;
};

module.exports = mongoose.model('User', UserSchema);
