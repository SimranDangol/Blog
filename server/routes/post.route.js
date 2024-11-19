import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getblogs,
  getUserBlogs,
  previewBlogContent,
  updateBlog,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("image"), createBlog);
router.route("/getblog").get(getblogs);
router.route("/getuserblog").get(verifyJWT, getUserBlogs);
router.route("/deletepost/:postId/:userId").delete(verifyJWT, deleteBlog);
router.route("/updatepost/:postId/:userId").put(verifyJWT, upload.single("image"), updateBlog);
router.route("/preview").get(previewBlogContent)

export default router;
