const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        user: {
          //type: mongoose.Schema.Types.ObjectId,
          type:String,
          ref: "User",
          required: true,
        },
        media: [
          {
            type: {
              type: String,
              enum: ["image", "video", "text"],
              
            },
            url: {
              type: String,
              required: true,
            },
          },
        ],
        caption: {
          type: String,
          required: true,
        },
        tags: [
          {
            type: String,
          },
        ],
        privacy: {
          type: String,
          enum: ["everyone", "following", "onlyme"],
          default: "everyone",
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        hiddenFrom: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        poll: {
          enabled: {
            type: Boolean,
            default: false,
          },
          duration: {
            type: Number,
            min: 1,
            max: 24 * 7, // Maximum duration of 1 week
            default: 24, // Default duration of 24 hours
          },
          options: [
            {
              type: String,
            },
          ],
          votes: [
            {
              user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
              option: {
                type: Number,
                min: 0,
                max: 9, // Maximum number of poll options
              },
            },
          ],
        },
        comments: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              
            },
            text: {
              type: String,
              
            },
            likes: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            ],
            reactions: [
              {
                user: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                },
                emoji: {
                  type: String,
                  enum: ["like", "love", "haha", "wow", "sad", "angry"],
                  
                },
              },
            ],
            createdAt: {
              type: Date,
              default: Date.now,
            },
            updatedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
{ timestamps: true });

module.exports = mongoose.model("post", PostSchema);