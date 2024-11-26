const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2')

// cast objectID to empty string (allow update with empty string)
const castObjectId = mongoose.ObjectId.cast()
mongoose.ObjectId.cast((v) => (v === '' ? v : castObjectId(v)))

const documentSchema = new Schema(
    {
        contentType: {
            type: String,
            trim: true,
            default: '',
        },
        contentSize: {
            type: Number,
            default: 0,
        },
        name: {
            type: String,
            trim: true,
            default: '',
        },
        extension: {
            type: String,
            trim: true,
            default: '',
        },
        filePath: {
            type: String,
            trim: true,
            default: '',
        },
        isVideo: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            default: '',
        },
        postId: {
            type: mongoose.Types.ObjectId,
            ref: 'Posts',
            default: '',
        }
    },
    {
        toObject: { virtuals: true, getters: true },
        toJSON: { virtuals: true, getters: true },
        timestamps: true,
    }
)

// Static method để chuyển đổi từ DTO
documentSchema.statics.fromDTO = function(fileDto) {
    if (!fileDto) return null;
    
    return {
        _id: fileDto.id,
        contentSize: fileDto.contentSize,
        contentType: fileDto.contentType,
        filePath: fileDto.filePath,
        name: fileDto.name,
        extension: fileDto.extension,
        isVideo: fileDto.isVideo
    };
}

documentSchema.plugin(mongooseAggregatePaginate)

let Document
try {
    Document = mongoose.model('Document', documentSchema)
} catch (e) {
    Document = mongoose.model('Document')
}

export default Document