import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Comment from "../models/comment.model.js";

export const addComment = asyncHandler(async (req, res) => {
  const { content, postId } = req.body;

  if (!req.user || !req.user.id) {
    throw new ApiError("Unauthorized access", 401);
  }

  const newComment = await Comment.create({
    content,
    userId: req.user.id,
    postId,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, "Comment created successfully", newComment));
});

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    createdAt: -1,
  });
  return res.status(200).json(new ApiResponse(200, comments));
});

export const editComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    return res.status(400).json({ error: "Comment ID is required" });
  }

  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (error) {
    return res.status(400).json({ error: "Invalid Comment ID format" });
  }

  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  // Check if user is authorized
  if (comment.userId.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You are not allowed to edit this comment" });
  }

  const editedComment = await Comment.findByIdAndUpdate(
    commentId,
    { content: req.body.content },
    { new: true }
  );

  if (!editedComment) {
    return res.status(400).json({ error: "Failed to update comment" });
  }

  res.status(200).json({ success: true, data: editedComment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // Check if commentId exists
  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  await Comment.findByIdAndDelete(commentId);
  res.status(200).json(new ApiResponse(200, "Comment has been deleted"));
});
