const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;
const { VALID_ROLES, NOTIFICATION_KINDS } = require("../../utils/constants");


const TargetSchema = new Schema({
  scope: {
    type: String,
    enum: ["user", "role"],
    required: true
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: function () {
      return this.scope === "user";
    }
  },
  role: {
    type: String,
    enum: VALID_ROLES,
    required: function () {
      return this.scope === "role";
    }
  }
}, { _id: false });

const ReadStateSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  readAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const NotificationSchema = new Schema({
  kind: {
    type: String,
    enum: NOTIFICATION_KINDS,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: String,
  image: String,
  data: Object,
  target: {
    type: TargetSchema,
    required: true
  },
  readBy: [ReadStateSchema]
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

NotificationSchema.index({ "target.scope": 1, "target.userId": 1, "target.role": 1 });

module.exports = model("Notification", NotificationSchema);
