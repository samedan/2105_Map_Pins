const { AuthenticatedError, PubSub } = require("apollo-server");
const Pin = require("./models/Pin");

// const user = {
//   _id: "1",
//   name: "Reed",
//   email: "same.dan@gmail.com",
//   picture: "https:// cloudinary",
// };

// SUBSCRIPTIONS
const pubsub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticatedError("You must be logged in");
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({})
        .populate("author")
        .populate("comments.author");
      return pins;
    },
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser,
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      // Data sent to the subscription
      pubsub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, ctx) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      // Data sent to the subscription
      pubsub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = await Pin.findOneAndUpdate(
        // find Pin gy ID
        { _id: args.pinId },
        // push comment into [comments]
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("author")
        .populate("comments.author");
      // Data sent to the subscription
      pubsub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
    }),
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator(PIN_ADDED),
    },
    pinDeleted: {
      subscribe: () => pubsub.asyncIterator(PIN_DELETED),
    },
    pinUpdated: {
      subscribe: () => pubsub.asyncIterator(PIN_UPDATED),
    },
  },
};
