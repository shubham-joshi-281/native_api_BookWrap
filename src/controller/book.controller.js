import bookModel from "../models/book.model.js";
import { v2 as cloudinary } from "cloudinary";

export const CreateBookController = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    const user = req.user;
    //  Validate input field
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide all the fields",
      });
    }

    //upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);

    const book = new bookModel({
      title,
      caption,
      rating,
      image: uploadResponse.secure_url,
      user,
    });

    await book.save();

    // success response
    return res.status(201).json({
      success: true,
      error: false,
      message: "Book created",
      data: book,
    });
  } catch (error) {
    console.log(`Error in Create book Controller ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `${error?.message || error} || Internal server error`,
    });
  }
};

export const FetchAllBookController = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const skip = page - 1 * limit;

    const books = await bookModel
      .find()
      .sort({ createdAt: -1 })
      .populate("user")
      .skip(skip)
      .limit(limit);

    //  Validate input field
    if (!books) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "No book found",
      });
    }

    const totalBooks = await bookModel.countDocuments();
    // success response
    return res.status(200).json({
      success: true,
      error: false,
      message: "Book fetched",
      data: {
        books,
        currentPage: page,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
      },
    });
  } catch (error) {
    console.log(
      `Error in fetching all book controller ${error?.message || error}`
    );
    return res.status(500).json({
      success: false,
      error: true,
      message: `${error?.message || error} || Internal server error`,
    });
  }
};

export const UserBookController = async (req, res) => {
  try {
    const user = req.user._id;
    const books = await bookModel.find(user).sort({ createdAt: -1 });

    //  Validate input field
    if (!books) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "No book found",
      });
    }

    const totalBooks = await bookModel.countDocuments();
    // success response
    return res.status(200).json({
      success: true,
      error: false,
      message: "User Book fetched",
      data: {
        books,
        totalBooks,
      },
    });
  } catch (error) {
    console.log(
      `Error in fetching user book controller ${error?.message || error}`
    );
    return res.status(500).json({
      success: false,
      error: true,
      message: `${error?.message || error} || Internal server error`,
    });
  }
};

export const DeleteBookByIdController = async (req, res) => {
  try {
    const book = await bookModel.findById(req.params.id);

    // Check book exist or not
    if (!book) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "No book found",
      });
    }

    // check user is the creator of this book
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Unauthozired to delete this book",
      });
    }

    // delete image from cloudinary
    if (book.image) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log(
          `Error while deleting image from cloudinary ${
            error?.message || error
          }`
        );
      }
    }
    await bookModel.deleteOne();

    return res.status(200).json({
      success: true,
      error: false,
      message: "Book deleted",
    });
  } catch (error) {
    console.log(`Error in Deleting book controller ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      error: true,
      message: `${error?.message || error} || Internal server error`,
    });
  }
};
