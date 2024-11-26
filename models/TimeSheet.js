const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeSheetSchema = new Schema(
    {
        dateAttendance: {
            type: Date,
            required: true,
        },
        note: {
            type: String,
        },
        ip: {
            type: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Liên kết tới bảng User
            required: false, // Không bắt buộc
        },
        isOffline: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Static method để tạo TimeSheet mới
TimeSheetSchema.statics.createTimeSheet = function (id, dateAttendance, note, ip, user, isOffline) {
    return new this({
        _id: id,
        dateAttendance,
        note,
        ip,
        user,
        isOffline,
    });
};

// Đảm bảo populate user khi query
TimeSheetSchema.pre(/^find/, function (next) {
    this.populate('user');
    next();
});

// Hàm để khi trả về sẽ gọi .toJson() để gửi format chuẩn cho client
TimeSheetSchema.set('toJSON', {
    virtuals: true, // Kích hoạt virtuals để xuất "id"
    transform: (doc, ret) => {
        ret.id = ret._id; // Thêm trường "id" (chuyển từ _id)
        delete ret._id; // Loại bỏ _id
        delete ret.__v; // Loại bỏ __v
        return ret;
    },
});

// Model TimeSheet
const TimeSheet = mongoose.model('TimeSheet', TimeSheetSchema);

module.exports = TimeSheet;
