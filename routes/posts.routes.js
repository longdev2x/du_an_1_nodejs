const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth.middleware'); 
const Posts = require('../models/Post');
const Likes = require('../models/Like');
const Comments = require('../models/Comment');
const Media = require('../models/Media');

// Helper function for response formatting
const formatResponse = (docs, page, limit, totalElements, totalPages) => {
    return {
        content: docs,
        pageable: {
            pageNumber: page - 1,
            pageSize: limit,
            sort: {
                sorted: false,
                unsorted: true,
            },
        },
        totalElements,
        totalPages,
        size: limit,
        first: page === 1,
        last: page === totalPages,
    };
};


// POST: /posts/get-news
router.post('/get-news', authenticateToken, async (req, res) => {
    const { keyWord = null, pageIndex = 1, size = 15, status = null } = req.body;

    try {
        const query = {
            ...(status ? { status } : {}),
            ...(keyWord ? { content: { $regex: keyWord, $options: 'i' } } : {})
        };

        const options = {
            page: parseInt(pageIndex, 10),
            limit: parseInt(size, 10),
            sort: { createdAt: -1 },
            populate: [
                { path: 'media' }, // Populating media if required
                { path: 'likes' },
                { path: 'comments' }
            ]
        };

        const result = await Posts.aggregatePaginate(
            Posts.aggregate().match(query).sort({ createdAt: -1 }), // Aggregate pipeline
            options
        );
        

        res.json(
            formatResponse(
                result.docs,
                result.totalDocs,
                result.limit,
                result.page,
                result.totalPages,
                result.hasPrevPage,
                result.hasNextPage,
                result.prevPage,
                result.nextPage
            )
        );
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Internal server error', error: err.message });
    }
});


// POST: /posts/create
router.post('/create', authenticateToken, async (req, res) => {
    const { content, media } = req.body; // Lấy content và media từ body

    try {
        // Tạo đối tượng mới cho bài viết
        const newPost = new Posts({ 
            content, 
            media: media || null, // Media không bắt buộc, nếu không có đặt giá trị null
            user : req.user.id, // Lấy userId từ token
        });

        const savedPost = await newPost.save(); // Lưu bài viết vào database

        res.status(200).json({
            code: 200,
            data: savedPost,
            message: 'Post created successfully'
        });
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: 'Failed to create post',
            error: err.message
        });
    }
});

// POST: /posts/likes/{id}
router.post('/likes/:id', authenticateToken, async (req, res) => {
    const { type, userId } = req.body;
    const { id } = req.params;

    try {
        const like = new Likes({ postId: id, type, userId, date: new Date() });
        const savedLike = await like.save();
        res.status(200).json({ code: 200, data: savedLike, message: 'Like added successfully' });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Failed to add like', error: err.message });
    }
});

// POST: /posts/comments/{id}
router.post('/comments/:id', authenticateToken, async (req, res) => {
    const { content, userId } = req.body;
    const { id } = req.params;

    try {
        const comment = new Comments({ postId: id, content, userId, date: new Date() });
        const savedComment = await comment.save();
        res.status(200).json({ code: 200, data: savedComment, message: 'Comment added successfully' });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Failed to add comment', error: err.message });
    }
});

// POST: /posts/update/{id}
router.post('/update/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { content, media } = req.body;

    try {
        const updatedPost = await Posts.findByIdAndUpdate(
            id,
            { content, media, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ code: 404, message: 'Post not found' });
        }

        res.json({ code: 200, data: updatedPost, message: 'Post updated successfully' });
    } catch (err) {
        res.status(500).json({ code: 500, message: 'Failed to update post', error: err.message });
    }
});

module.exports = router;
