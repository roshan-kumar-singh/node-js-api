const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
    {
        userId: {
          type: String,
          ref: 'User',
          required: true
        },
        mediaType: {
          type: String,
          enum: ['image', 'video', 'text'],
          required: true
        },
        mediaUrl: {
          type: String,
          required: true
        },
        likes: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }],
        comments: [{
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          text: {
            type: String,
            required: true
          },
          reactions: [{
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              required: true
            },
            emoji: {
              type: String,
              required: true
            }
          }]
        }],
        shares: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }]
      },
{ timestamps: true });

module.exports = mongoose.model("story", storySchema);