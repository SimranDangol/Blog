/* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { Button } from "./ui/button";
// import { Textarea } from "./ui/textarea";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import Comment from "./Comment";

// // eslint-disable-next-line react/prop-types
// const CommentSection = ({ postId }) => {
//   const { currentUser } = useSelector((state) => state.user);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [comments, setComments] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (comment.length === 0 || comment.length > 200 || isSubmitting) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await axios.post(
//         `/api/v1/comment/add`,
//         { content: comment, postId },
//         { headers: { Authorization: `Bearer ${currentUser.token}` } }
//       );

//       const newComment = {
//         _id: response.data.data._id,
//         content: comment, postId,
//         createdAt: new Date().toISOString(),
//         userId: currentUser.data._id,
//       };

//       setComments((prevComments) => [newComment, ...prevComments]);

//       toast.success("Comment added successfully!");
//       setComment("");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = (updatedComment) => {
//     setComments((prevComments) =>
//       prevComments.map((comment) =>
//         comment._id === updatedComment._id ? updatedComment : comment
//       )
//     );
//   };

//   const handleDelete = (deletedCommentId) => {
//     setComments((prevComments) =>
//       prevComments.filter((comment) => comment._id !== deletedCommentId)
//     );
//   };

//   useEffect(() => {
//     const getComments = async () => {
//       try {
//         const response = await axios.get(
//           `/api/v1/comment/getcomments/${postId}`
//         );
//         setComments(response.data.data);
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to load comments");
//       }
//     };
//     getComments();
//   }, [postId]);

//   return (
//     <div className="w-full max-w-2xl p-3 mx-auto">
//       {currentUser ? (
//         <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
//           <p>Logged in as:</p>
//           {currentUser.data?.profilePicture && (
//             <img
//               className="object-cover w-5 h-5 rounded-full"
//               src={currentUser.data.profilePicture}
//               alt="User profile"
//             />
//           )}
//           <Link
//             to="/dashboard?tab=profile"
//             className="text-xs text-cyan-600 hover:underline"
//           >
//             @{currentUser.data?.email}
//           </Link>
//         </div>
//       ) : (
//         <div className="flex gap-1 my-5 text-sm text-teal-500">
//           You must be logged in to comment.{" "}
//           <Link className="text-blue-500 hover:underline" to="/login">
//             Login
//           </Link>
//         </div>
//       )}
//       {currentUser && (
//         <form className="p-3 rounded-md" onSubmit={handleSubmit}>
//           <Textarea
//             placeholder="Add a comment"
//             rows="3"
//             maxLength="200"
//             onChange={(e) => setComment(e.target.value)}
//             value={comment}
//             disabled={isSubmitting}
//           />
//           <div className="flex items-center justify-between mt-5">
//             <p>{200 - comment.length}</p>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </Button>
//           </div>
//         </form>
//       )}
//       {comments.length === 0 ? (
//         <p className="my-5 text-sm">No comments yet!</p>
//       ) : (
//         <>
//           <div className="flex items-center gap-1 my-5 text-sm">
//             <p>Comments</p>
//             <div className="px-2 py-1 border border-gray-400 rounded-sm">
//               <p>{comments.length}</p>
//             </div>
//           </div>
//           {comments.map((comment) => (
//             <Comment
//               key={comment._id}
//               comment={comment}
//               onEdit={handleEdit}
//               onDelete={handleDelete}
//             />
//           ))}
//         </>
//       )}
//     </div>
//   );
// };

// export default CommentSection;

/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Comment from "./Comment";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const CommentSection = ({ postId, onCommentUpdate }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (comment.length === 0 || comment.length > 200 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `/api/v1/comment/add`,
        { content: comment, postId },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );

      const newComment = {
        _id: response.data.data._id,
        content: comment,
        postId,
        createdAt: new Date().toISOString(),
        userId: currentUser.data._id,
      };

      const updatedComments = [newComment, ...comments];
      setComments(updatedComments);
      // Update the comment count in parent component
      onCommentUpdate(updatedComments.length);

      toast.success("Comment added successfully!");
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleDelete = (deletedCommentId) => {
    setComments((prevComments) => {
      const filteredComments = prevComments.filter(
        (comment) => comment._id !== deletedCommentId
      );
      // Update the comment count after deletion
      onCommentUpdate(filteredComments.length);
      return filteredComments;
    });
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(
          `/api/v1/comment/getcomments/${postId}`
        );
        setComments(response.data.data);
        // Update initial comment count
        onCommentUpdate(response.data.data.length);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load comments");
      }
    };
    getComments();
  }, [postId, onCommentUpdate]);

  return (
    <div className="w-full max-w-4xl p-3 mx-auto ">
      {currentUser ? (
        <div className="flex items-center gap-1 pl-4 my-5 text-sm text-gray-500">
          <p>Logged in as:</p>
          <Avatar className="w-5 h-5">
            <AvatarImage src={currentUser.data?.profilePicture} alt="User profile" />
            <AvatarFallback>
              {currentUser.data?.name?.[0] || currentUser.data?.email?.[0]}
            </AvatarFallback>
          </Avatar>
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.data?.email}
          </Link>
        </div>
      ) : (
        <div className="flex gap-1 my-5 text-sm text-teal-500">
          You must be logged in to comment.{" "}
          <Link className="text-blue-500 hover:underline" to="/login">
            Login
          </Link>
        </div>
      )}
      {currentUser && (
        <form className="p-3 rounded-md" onSubmit={handleSubmit}>
          <Textarea
            placeholder="Add a comment"
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-5">
            <p>{200 - comment.length}</p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="my-5 text-sm">No comments yet!</p>
      ) : (
        <>
          <div className="flex items-center gap-1 my-5 text-sm">
            <p>Comments</p>
            <div className="px-2 py-1 border border-gray-400 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;