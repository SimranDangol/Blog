/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const Comment = ({ comment, onDelete, onEdit }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/v1/user/${comment.userId}`);
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [comment]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setEditedContent(comment.content);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.patch(
        `/api/v1/comment/editComment/${comment._id}`,
        {
          content: editedContent,
        }
      );
      comment.content = response.data.data.content;
      setIsEditing(false);
      setError(null);
      toast.success("Comment edited successfully");
    } catch (err) {
      console.error("Error updating comment:", err);
      setError("Failed to update comment. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/comment/deleteComment/${comment._id}`);
      onDelete && onDelete(comment._id);
      toast.success("Comment deleted Successfully");
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError("Failed to delete comment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center p-4 space-x-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex p-4 text-sm border-b dark:border-gray-600">
      <div className="flex-shrink-0 mr-3">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={user?.profilePicture}
            alt={user?.fullName || "User avatar"}
          />
          <AvatarFallback className="bg-primary/10">
            {getInitials(user?.fullName)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="mr-2 text-sm font-medium">
            {user?.fullName || "Anonymous User"}
          </span>
          <span className="text-xs text-muted-foreground">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSaveEdit}
                variant="default"
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                Save
              </Button>
              <Button
                onClick={handleEditToggle}
                variant="secondary"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-2 text-muted-foreground">{comment.content}</p>
            <div className="flex gap-4">
              <Button
                onClick={handleEditToggle}
                variant="ghost"
                size="sm"
                className="p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <Edit2 size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="sm"
                className="p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Comment;