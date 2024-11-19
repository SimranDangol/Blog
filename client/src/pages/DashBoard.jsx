import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PenSquare, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion"; // Import framer-motion

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(3);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("/api/v1/post/getuserblog");
        setBlogPosts(response.data.data.posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(
        `/api/v1/post/deletepost/${postId}/${currentUser?.data?.id}`
      );
      setBlogPosts(blogPosts.filter((post) => post._id !== postId));
      toast.success("Blog deleted Successfully");
    } catch (error) {
      console.error("Error deleting the post:", error);
      toast.error("Fail to delete Blog");
    }
  };

  const handleShowMore = () => {
    setVisiblePosts(visiblePosts + 3); // Show 3 more posts on each click
  };

  return (
    <div className="max-w-6xl p-8 mx-auto space-y-8">
      {/* Header Section with animation */}
      <motion.div
        initial={{ opacity: 0, y: -30 }} // Start with 0 opacity and -30 for y-axis
        animate={{ opacity: 1, y: 0 }} // Animate to full opacity and y: 0
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-between gap-4 mb-8 sm:flex-row"
      >
        <div className="flex items-center gap-3">
          <Avatar className="rounded-lg h-14 w-14">
            <AvatarImage src={currentUser?.data?.profilePicture} alt="User" />
            <AvatarFallback>
              {currentUser?.data?.fullName
                ? currentUser?.data?.fullName[0]
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Hello, {currentUser?.data?.fullName || "User"}
            </h1>
            <p className="text-sm text-gray-500">
              {currentUser?.data?.email || "user@example.com"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/create-blog">
            <Button className="flex items-center gap-2 px-5 py-2">
              <PenSquare className="w-4 h-4" />
              Create Blog
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Animated Cards */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 px-5 py-6">
              <div className="p-4 rounded-lg bg-blue-50">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">My Total Posts</p>
                <h3 className="text-3xl font-bold">{blogPosts.length}</h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 px-5 py-6">
              <div className="p-4 rounded-lg bg-purple-50">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500"> Total Views on my Post</p>
                <h3 className="text-3xl font-bold">
                  {blogPosts
                    .reduce((sum, post) => sum + (post.views || 0), 0)
                    .toLocaleString()}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex items-center gap-4 px-5 py-6">
              <div className="p-4 rounded-lg bg-green-50">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Total Comments on my Post
                </p>
                <h3 className="text-3xl font-bold">
                  {blogPosts.reduce(
                    (sum, post) => sum + (post.commentsCount || 0),
                    0
                  )}
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Animated Blog Posts Table */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  My Blog Posts
                </CardTitle>
                <p className="text-sm text-gray-500">Manage your content</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-8 text-center">Loading posts...</div>
            ) : blogPosts.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <BookOpen className="mb-4 text-gray-300 h-14 w-14" />
                <h3 className="mb-2 text-lg font-medium">
                  No blog posts found
                </h3>
                <p className="mb-6 text-gray-500">
                  You {"haven't"} created any posts yet
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Post</TableHead>
                      <TableHead className="w-[150px]">Title</TableHead>
                      <TableHead className="w-[150px]">Category</TableHead>
                      <TableHead className="w-[150px]">Published</TableHead>
                      <TableHead className="w-[150px]">Views</TableHead>
                      <TableHead className="w-[150px]">Comments</TableHead>
                      <TableHead className="w-[150px] text-center">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell className="flex items-center gap-2">
                          <Link to={`/post/${post.slug}`}>
                            <img
                              src={post.image || "/api/placeholder/120/80"}
                              alt={post.title}
                              className="object-cover w-20 h-12 rounded-lg"
                            />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/post/${post.slug}`}
                            className=" hover:underline"
                          >
                            {post.title}
                          </Link>
                        </TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {(post.views || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>{post.commentsCount || 0}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            {/* Edit Button */}
                            <Link to={`/update-blog/${post._id}`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="w-4 h-4 text-gray-500" />
                              </Button>
                            </Link>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(post._id)}
                            >
                              <Trash2 className="w-4 h-4 text-gray-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {/* Show More Button */}
            {blogPosts.length > visiblePosts && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={handleShowMore}>
                  Show More
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
