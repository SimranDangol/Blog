// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CalendarIcon, ArrowRight } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";

// const Blogs = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   console.log(currentUser);

//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [visiblePosts, setVisiblePosts] = useState(6);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(
//           `/api/v1/post/getblog?userId=${currentUser.data._id}`
//         );
//         setPosts(res.data.data.posts || []);
//       } catch (error) {
//         console.error("Failed to fetch blog:", error.message);
//         toast.error("Failed to fetch blog: " + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, [currentUser.data._id]);

//   const handleShowMore = () => {
//     setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 6);
//   };

//   const handleReadMore = (slug) => {
//     navigate(`/post/${slug}`);
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-center">
//         <div className="grid w-full max-w-screen-lg grid-cols-1 gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-3">
//           {loading ? (
//             <div className="flex items-center justify-center p-8 col-span-full">
//               <div className="text-lg animate-pulse">Loading posts...</div>
//             </div>
//           ) : posts.length > 0 ? (
//             posts.slice(0, visiblePosts).map((post) => (
//               <Card
//                 key={post._id}
//                 className="mx-auto overflow-hidden transition-all duration-300 transform border rounded-xl w-80 hover:shadow-xl hover:scale-102 bg-card"
//               >
//                 {post.image && (
//                   <div className="relative w-full overflow-hidden h-44">
//                     <img
//                       src={post.image}
//                       alt={post.title}
//                       className="object-cover w-full h-full transition-all duration-500 ease-in-out transform hover:scale-105"
//                     />
//                   </div>
//                 )}

//                 <CardContent className="p-4 space-y-3 ">
//                   <div className="space-y-2">
//                     <Badge variant="secondary" className="mb-1">
//                       {post.category}
//                     </Badge>
//                     <h2 className="text-lg font-semibold tracking-tight">
//                       {post.title}
//                     </h2>
//                     <p className="text-sm text-muted-foreground line-clamp-2">
//                       {post.subtitle}
//                     </p>
//                   </div>

//                   <div className="flex items-center justify-between pt-3 border-t">
//                     <div className="flex items-center space-x-2">
//                       <div className="relative overflow-hidden rounded-full w-7 h-7">
//                         <img
//                           src={post.profilePicture}
//                           alt="Author"
//                           className="object-cover w-full h-full"
//                         />
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium leading-none">
//                           {post.author}
//                         </p>
//                         <div className="flex items-center text-xs text-muted-foreground">
//                           <CalendarIcon className="w-3 h-3 mr-1" />
//                           {new Date(post.updatedAt).toLocaleDateString(
//                             undefined,
//                             {
//                               year: "numeric",
//                               month: "short",
//                               day: "numeric",
//                             }
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <Button
//                     className="w-full transition-all duration-300"
//                     variant="secondary"
//                     onClick={() => handleReadMore(post.slug)}
//                   >
//                     Read More
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <div className="p-8 text-center col-span-full">
//               <div className="text-lg text-muted-foreground">
//                 No posts available!
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Show More Button */}
//       {visiblePosts < posts.length && (
//         <div className="flex justify-center mt-6">
//           <Button
//             onClick={handleShowMore}
//             variant="outline"
//             className="px-4 py-2"
//           >
//             Show More
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Blogs;



import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion"; 
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Blogs = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Fetching all posts (no userId filter)
        const res = await axios.get(`/api/v1/post/getblog`);
        console.log("API Response:", res.data);
        setPosts(res.data?.data?.posts || []);
      } catch (error) {
        console.error("Failed to fetch blog:", error.message);
        toast.error("Failed to fetch blog: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleShowMore = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 6);
  };

  const handleReadMore = (slug) => {
    navigate(`/post/${slug}`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <motion.div
          className="grid w-full max-w-screen-lg grid-cols-1 gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 100 }} // Start from below the screen
          animate={{ opacity: 1, y: 0 }} // Animate to visible position
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center p-8 col-span-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length > 0 ? (
            posts.slice(0, visiblePosts).map((post) => (
              <Card
                key={post._id}
                className="mx-auto overflow-hidden transition-all duration-300 transform border rounded-xl w-80 hover:shadow-xl hover:scale-102 bg-card"
              >
                {post.image && (
                  <div className="relative w-full overflow-hidden h-44">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full transition-all duration-500 ease-in-out transform hover:scale-105"
                    />
                  </div>
                )}

                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mb-1">
                      {post.category}
                    </Badge>
                    <h2 className="text-lg font-semibold tracking-tight ">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <div className="relative overflow-hidden rounded-full w-7 h-7">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={post.profilePicture} alt="Author" />
                        <AvatarFallback>
                          {post.author ? post.author.split(" ").map((n) => n[0]).join("") : "?"}
                        </AvatarFallback>
                      </Avatar>
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {post.author}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarIcon className="w-3 h-3 mr-1" />
                          {new Date(post.updatedAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full transition-all duration-300"
                    variant="secondary"
                    onClick={() => handleReadMore(post.slug)}
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="p-8 text-center col-span-full">
              <div className="text-lg text-muted-foreground">
                No posts available!
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Show More Button */}
      {visiblePosts < posts.length && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleShowMore}
            className="px-4 py-2"
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
};

export default Blogs;

