import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const generateBlogContent = async (title, category) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Write an engaging and informative blog post about "${title}" for the category "${category}" without including any introductory title or headline. 
                     Requirements:
                     1. Start directly with the introduction to hook the reader and introduce the topic.
                     2. Main Content: Well-structured points with examples.
                     3. Conclusion: Summarize key points effectively.
                     4. Tone: Professional yet conversational.
                     5. Length: Approximately 1000 words.
                     6. Format: Use proper paragraphs without adding a title at the beginning.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Content Generation Error:", error);
    throw error;
  }
};

export const createBlog = asyncHandler(async (req, res) => {
  // Checking if an image was uploaded
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  // Path to the uploaded file
  const localFilePath = req.file.path;

  // Upload to Cloudinary
  const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

  const { userId, title, category, author, content, useAI } = req.body; // Added 'useAI' here

  let generatedContent = content; // Default content is from the request

  // Generate content using AI if requested
  if (useAI === "true") {
    try {
      generatedContent = await generateBlogContent(title, category);
    } catch (error) {
      throw new ApiError(500, "Failed to generate AI content");
    }
  }

  // Generate a slug from the title
  const slug = title.toLowerCase().replace(/\s+/g, "-").split(" ").join("-");

  // Create new post
  const newPost = await Post.create({
    userId: req.user._id,
    content: generatedContent,
    title,
    slug,
    category,
    image: cloudinaryResponse.secure_url,
    author,
    isAIGenerated: useAI === "true", // Flag for AI-generated content
  });

  res.status(201).json(
    new ApiResponse(201, "Post created successfully", {
      post: newPost,
      slug: newPost.slug,
    })
  );
});

export const previewBlogContent = asyncHandler(async (req, res) => {
  const { title, category } = req.query;

  try {
    const previewContent = await generateBlogContent(title, category);
    res.status(200).json(previewContent);
  } catch (error) {
    throw new ApiError(500, "Failed to generate preview content");
  }
});


export const getblogs = asyncHandler(async (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 100;
  const sortDirection = req.query.order === "asc" ? 1 : -1;

  const queryObject = {
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.slug && { slug: req.query.slug }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ],
    }),
  };

  const posts = await Post.find(queryObject)
    .populate("userId", "profilePicture fullName")
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit)
    .lean();

  const postsWithAuthor = posts.map((post) => ({
    ...post,
    author: post.userId?.fullName || "Anonymous",
    profilePicture:
      post.userId?.profilePicture ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    views: post.views || 0,
    commentsCount: post.commentsCount || 0,
  }));

  const postsWithCommentCount = await Promise.all(
    postsWithAuthor.map(async (post) => {
      const commentsCount = await Comment.countDocuments({ postId: post._id });
      return { ...post, commentsCount };
    })
  );

  // Update view count if slug is provided
  if (req.query.slug) {
    await Post.findOneAndUpdate(
      { slug: req.query.slug },
      { $inc: { views: 1 } }
    );
  }

  const totalPosts = await Post.countDocuments(queryObject);
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  const lastMonthPosts = await Post.countDocuments({
    ...queryObject,
    createdAt: { $gte: oneMonthAgo },
  });

  return res.status(200).json(
    new ApiResponse(200, {
      posts: postsWithCommentCount,
      totalPosts,
      lastMonthPosts,
    })
  );
});


export const getUserBlogs = asyncHandler(async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json(new ApiResponse(401, { message: "User not authenticated" }));
    }

    const userId = req.user._id;

    // Validate userId
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Build the query object
    let queryObject = {
      userId,
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    // If postId is provided, override other filters to get specific post
    if (req.query.postId) {
      queryObject = {
        _id: req.query.postId,
        userId, // Keep userId check for security
      };
    }

    const posts = await Post.find(queryObject)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .lean();

    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          postId: post._id,
        });
        return { ...post, commentsCount };
      })
    );

    const totalPosts = await Post.countDocuments(queryObject);

    return res.status(200).json(
      new ApiResponse(200, {
        posts: postsWithCommentCount,
        totalPosts,
      })
    );
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, { message: "Internal server error" }));
  }
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { postId, userId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Post deleted successfully"));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { postId, userId } = req.params;
  const { title, category, content } = req.body;
  let { image } = req.body;

  // Handle image update
  if (req.file) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    image = uploadedImage.secure_url;
  }

  const post = await Post.findOneAndUpdate(
    { _id: postId, userId },
    { title, category, content, image },
    { new: true }
  );

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(new ApiResponse(200, "Blog updated successfully", post));
});


