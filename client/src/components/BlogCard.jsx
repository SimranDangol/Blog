/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function BlogCard({ post }) {
  const avatarUrl = post.profilePicture || null;
  const authorName = post.author || "Unknown";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (post) {
      setTimeout(() => {
        setIsLoading(false); // Hide loader after data is "loaded"
      }, 1000); // Simulate 1s load delay
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mx-auto w-80 h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden transition-all duration-300 transform border rounded-xl w-80 hover:shadow-xl hover:scale-102 bg-card">
      {post.image && (
        <div className="relative w-full overflow-hidden h-44">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full transition-all duration-500 ease-in-out transform hover:scale-105"
          />
        </div>
      )}

      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <Badge variant="secondary" className="mb-1">
            {post.category}
          </Badge>
          <h2 className="text-lg font-semibold tracking-tight">{post.title}</h2>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Avatar className="w-7 h-7">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={authorName} />
              ) : (
                <AvatarFallback>{authorName.charAt(0)} </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{authorName}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {new Date(post.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        <Link to={`/post/${post.slug}`}>
          <Button
            className="w-full my-2 transition-all duration-300"
            variant="secondary"
          >
            Read More
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
