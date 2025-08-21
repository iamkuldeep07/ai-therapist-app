import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  name: string;
  desciption: string;
  duration: number;
  timestamp: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "meditation",
        "exercise",
        "walking",
        "reading",
        "journaling",
        "therapy",
      ],
    },
    name: {
      type: String,
      required: true,
    },
    desciption: {
      type: String,
    },
    duration: {
      type: Number,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ userId: 1, timestamp: -1 });

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
