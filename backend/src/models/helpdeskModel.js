import mongoose from "mongoose";

const helpdeskSchema = new mongoose.Schema(
  {
    issueCode: {
      type: String,
      required: [true, "Issue code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    responseText: {
      type: String,
      required: [true, "Response content is required"],
      maxlength: [5000, "Response too long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Account", "Payment", "Technical", "Service", "General"],
      default: "General",
    },

    createdBy: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

const HelpdeskResponse = mongoose.model("HelpdeskResponse", helpdeskSchema);

export default HelpdeskResponse;
