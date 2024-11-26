const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 150,
        index: true,
        default: "ROLE_USER"
    },
    authority: {
        type: String,
        maxLength: 512,
        default: "ROLE_USER"
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

// Trả về đối tượng role với id, name và authority
RoleSchema.methods.toJSON = function() {
    const role = this.toObject();
    role.id = role._id;
    delete role._id;
    delete role.__v;
    return role;
};

module.exports = mongoose.model('Role', RoleSchema);
