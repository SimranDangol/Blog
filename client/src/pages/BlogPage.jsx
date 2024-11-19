import { useEffect, useState } from "react";
import { MessageCircle, Clock, Eye, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import CommentSection from "@/components/CommentSection";
import ScrollToTop from "@/components/ScrollToTop";

const DashBlog = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [viewCountLoading, setViewCountLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/post/getblog?slug=${postSlug}`);
        const data = await response.json();

        if (data.statusCode === 200 && data.data.posts.length > 0) {
          const postData = data.data.posts[0];
          setPost(postData);
          setCommentsCount(postData.commentsCount || 0);

          const storedViewCount = localStorage.getItem(postData._id);
          if (!storedViewCount) {
            setViewsCount((prev) => prev + 1);
            localStorage.setItem(postData._id, "viewed");
          } else {
            setViewsCount(postData.views);
          }

          setTimeout(() => setViewCountLoading(false), 1000);
          setTimeout(() => setContentLoading(false), 500);
        } else {
          toast.error("Post not found");
        }
      } catch (err) {
        toast.error("Failed to fetch post");
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postSlug) {
      fetchPost();
    }
  }, [postSlug]);

  const handleCommentUpdate = (count) => {
    setCommentsCount(count);
  };

  const addNumberingToContent = (content) => {
    let headingCounter = 1;
    let boldCounter = 1;

    return content
      .replace(/<h([1-6])>(.*?)<\/h\1>/g, (_, level, text) => {
        return `<h${level}>${headingCounter++}. ${text}</h${level}>`;
      })
      .replace(/(\*\*)(.*?)\1/g, (_, delimiter, text) => {
        return `<span class="font-bold">${boldCounter++}. ${text}</span>`;
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 text-gray-900 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Post not found or failed to load.</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col max-w-4xl min-h-screen mx-auto">
      <ScrollToTop />
      <article className="px-4 py-8 md:px-6 lg:px-8">
        <Card className="overflow-hidden border-none shadow-lg">
          <CardContent className="p-6">
            {/* Header Section */}
            <header className="mb-8">
              <h1 className="mb-6 text-3xl font-bold text-center text-gray-900 md:text-4xl lg:text-5xl dark:text-gray-100">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  {viewCountLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>{viewsCount} views</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>{commentsCount} comments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{Math.ceil(post.content.length / 1000)} min read</span>
                </div>
              </div>

              {/* Category */}
              {post.category && (
                <Link
                  to={`/search?category=${post.category}`}
                  className="flex justify-center"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {post.category}
                  </Button>
                </Link>
              )}
            </header>

            {/* Featured Image */}
            {post.image && (
              <figure className="flex justify-center mb-8">
                {contentLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-contain w-full h-auto max-w-3xl rounded-lg shadow-md"
                    loading="lazy"
                  />
                )}
              </figure>
            )}

            {/* Author Info */}
            <div className="flex items-center justify-between p-4 mb-8 border-gray-200 border-y dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  {post.profilePicture && (
                    <AvatarImage
                      src={post.profilePicture}
                      alt={post.author || "Author"}
                    />
                  )}
                  <AvatarFallback className="text-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                    {post.author ? post.author[0].toUpperCase() : "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{post.author}</h3>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div
              className="prose prose-lg whitespace-pre-wrap dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: addNumberingToContent(post.content),
              }}
            />
          </CardContent>
        </Card>

        {/* Comments Section */}
        {post._id && (
          <div className="mt-8">
            <CommentSection
              postId={post._id}
              onCommentUpdate={handleCommentUpdate}
              initialCount={commentsCount}
            />
          </div>
        )}
      </article>
    </main>
  );
};

export default DashBlog;
