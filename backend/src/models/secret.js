const mongoose = require('mongoose');

const { Schema } = mongoose;

const SecretSchema = new Schema(
  {
    secretText: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      unique: true,
    },
    expiresAt: Date,
    remainingViews: {
      type: Number,
      min: [1, 'remainingViews cannot be less than 1'],
      default: 1,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  }
);

const Secret = mongoose.model('Secret', SecretSchema);

module.exports = Secret;
