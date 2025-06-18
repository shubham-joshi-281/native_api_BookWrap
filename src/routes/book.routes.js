import express from "express";

import { CreateBookController, DeleteBookByIdController, FetchAllBookController } from "../controller/book.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/create", isAuthenticated, CreateBookController);

router.get("/get", isAuthenticated, FetchAllBookController);

router.get("/user", isAuthenticated, UserBookController);

router.delete("/delete", isAuthenticated, DeleteBookByIdController);

export default router;
