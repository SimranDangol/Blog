/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const UpdateBlog = () => {
  const { postId, userId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser.data._id);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/post/getuserblog?postId=${postId}`
        );
        const post = data.data.posts[0];
        setTitle(post.title);
        setCategory(post.category);
        setContent(post.content);
        setImagePreview(post.image);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post data.");
      }
    };
    fetchPost();
  }, [postId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.put(
        `/api/v1/post/updatepost/${postId}/${currentUser.data._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update blog .");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[rgba(10,10,10,0.5)]">
      <Card className="max-w-4xl m-3 mx-auto rounded-lg shadow-lg">
        <CardContent className="p-6">
          <h1 className="mb-6 text-2xl font-semibold text-center">Edit Blog</h1>

          {/* Title Input */}
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 border dark:border-gray-700 focus:outline-none"
          />

          {/* Category Select */}
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="w-full mb-4 focus:outline-none dark:border-gray-700">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>

          {/* Image Upload Section */}
          <div className="p-4 mb-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <Button variant="secondary" className="focus:outline-none">
                <label className="p-3 rounded-lg cursor-pointer">
                  Choose file
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </Button>
              <span className="text-gray-500 dark:text-gray-400">
                {image ? image.name : "No file chosen"}
              </span>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Uploaded Preview"
                className="object-cover w-full mb-4 h-72"
              />
            )}
          </div>

          {/* Text Editor for Content */}
          <div className="mb-4">
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Write something..."
              theme="snow"
              className="h-64 custom-quill"
            />
          </div>

          {/* Update Button with Loading Spinner */}
          <Button
            onClick={handleUpdate}
            className="w-full mt-16 sm:my-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 focus:outline-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 animate-spin" /> Updating...
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateBlog;

