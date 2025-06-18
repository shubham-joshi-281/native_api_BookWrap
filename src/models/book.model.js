import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    rating: {
      type: String,
      default: "",
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);

const bookModel = mongoose.model("Book", bookSchema);

export default bookModel;
