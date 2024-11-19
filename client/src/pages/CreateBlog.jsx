import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [aiContent, setAIContent] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const fetchAIContent = async () => {
    if (!title || !category) {
      toast.error("Title and category are required for AI content generation");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/post/preview`, {
        params: { title, category },
      });
      setAIContent(response.data);
      toast.success("AI content generated successfully!");
    } catch (error) {
      console.error("Error generating AI content:", error);
      toast.error("Failed to generate AI content.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !category || !image) {
      toast.error("All fields are required, including an uploaded image");
      return;
    }

    // If AI is not used, content is required
    if (!useAI && !content) {
      toast.error("Content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", useAI ? aiContent : content); // If AI is used, send AI content, otherwise manual content
    if (image) formData.append("image", image);
    formData.append("useAI", useAI ? "true" : "false");

    setLoading(true);

    try {
      const response = await axios.post("/api/v1/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Post created successfully!");
      navigate(`/post/${response.data.message.post.slug}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[rgba(10,10,10,0.5)]">
      <ScrollToTop />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl m-3 mx-auto rounded-lg shadow-lg">
          <CardContent className="p-6">
            <h1 className="mb-6 text-2xl font-semibold text-center">
              Create a Blog
            </h1>

            <Input
              type="text"
              placeholder="Title"
              className="mb-4 border dark:border-gray-700 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Select onValueChange={setCategory}>
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

            <div className="flex items-center mb-4">
              <Switch checked={useAI} onCheckedChange={setUseAI} />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Use AI to generate content
              </span>
            </div>

            {useAI && (
              <div className="mb-4">
                <Button
                  onClick={fetchAIContent}
                  className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 animate-spin" /> Generating...
                    </div>
                  ) : (
                    "Generate AI Content"
                  )}
                </Button>
                <textarea
                  readOnly
                  value={aiContent}
                  className="w-full h-32 p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                  placeholder="AI-generated content will appear here"
                />
              </div>
            )}

            <div className="p-4 mb-4 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <Button variant="secondary">
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

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Uploaded Preview"
                  className="object-cover w-full mb-4 h-72"
                />
              )}
            </div>

            <ReactQuill
              theme="snow"
              className="h-64 custom-quill"
              value={content}
              onChange={setContent}
              placeholder="Write or edit the AI-generated content here..."
            />

            <Button
              onClick={handlePublish}
              className="w-full mt-20 sm:my-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 animate-spin" /> Publishing...
                </div>
              ) : (
                "Publish"
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateBlog;


