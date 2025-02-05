const mongoose = require("mongoose");
const connectionRequestModel = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      require: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored","interested","accept","reject"],
        message: `{VALUE} is not matched with any status`,
      },
    },
  },
  {
    timestamps: true,
  }
);
const Request = mongoose.model("connectionRequest", connectionRequestModel);
module.exports = Request;