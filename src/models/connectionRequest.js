const mongoose = require('mongoose');
const User = require('./user');

const connectRequestSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,    // to join the User model so that we can fetch the User models data through fromId of connectRequest model
      required: true,
    },
    toId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User, // to get to
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['accepted', 'rejected', 'interested', 'ignored'],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectRequestSchema.pre('save', function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromId.equals(connectionRequest.toId)) {
    throw new Error(" Can't establish the connection!...");
  }

  next();
});

const ConnectionRequest = mongoose.model(
  'ConnectionRequest',
  connectRequestSchema
);

module.exports = ConnectionRequest;
