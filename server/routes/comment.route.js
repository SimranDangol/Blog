import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { editComment } from "../controllers/comment.controller.js";

const router = Router();

router.route("/add").post(verifyJWT, addComment);
router.route("/getcomments/:postId").get(getComments);
router.route("/editComment/:commentId").patch(verifyJWT, editComment);
router.route("/deleteComment/:commentId").delete(verifyJWT,deleteComment);


export default router;
