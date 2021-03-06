const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must be about some user']
    },
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Comment must have a sender']
    },
    sentAt: {
        type: Date,
        required: [true, 'Comment must have a timestamp']
    },
    comment: {
        type: String,
        required: [true, 'Empty comments are not allowed']
    }
});

// commentSchema.index({ user: 1, from: 1 }, { unique: true });

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'from',
        select: '-__v -passwordChangedAt -friends -games -pendingFriendRequests -receivedFriendRequests -deletedFriends -privileges -email -updatedPrivateConversations -updatedGroupConversations -privateConversations -groupConversations -friendly -goodTeacher -skilledPlayer -praisedPlayers'
    }).select('-__v');

    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;