const { AuthenticatedError } = require("apollo-server");
const Pin = require("./models/Pin");

// const user = {
//   _id: "1",
//   name: "Reed",
//   email: "same.dan@gmail.com",
//   picture: "https:// cloudinary",
// };

const authenticated = (next) => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticatedError("You must be logged in");
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser,
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      return pinAdded;
    }),
  },
};
