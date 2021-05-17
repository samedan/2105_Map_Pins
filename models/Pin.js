const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    image: String,
    latitude: Number,
    longitude: Number,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    comments: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: date.now,
        },
        author: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  // gets an automated 'createdAt' or 'updatedAt'
  { timestamps: true }
);

mondule.exports = mongoose.model("Pin", PinSchema);
