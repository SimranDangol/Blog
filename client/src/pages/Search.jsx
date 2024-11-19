import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const sortFromUrl = urlParams.get("sort");
        const categoryFromUrl = urlParams.get("category");

        setSidebarData({
          searchTerm: searchTermFromUrl || "",
          sort: sortFromUrl || "desc",
          category: categoryFromUrl || "uncategorized",
        });

        const apiUrl = new URL("/api/v1/post/getblog", window.location.origin);
        if (searchTermFromUrl)
          apiUrl.searchParams.set("searchTerm", searchTermFromUrl);
        if (sortFromUrl) apiUrl.searchParams.set("sort", sortFromUrl);
        if (categoryFromUrl && categoryFromUrl !== "uncategorized") {
          apiUrl.searchParams.set("category", categoryFromUrl);
        }

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch posts");
        }

        if (data.data && Array.isArray(data.data.posts)) {
          setPosts(data.data.posts);
          setShowMore(data.data.posts.length >= 9);
        } else {
          setPosts([]);
          setShowMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    if (sidebarData.searchTerm) {
      urlParams.set("searchTerm", sidebarData.searchTerm);
    }
    if (sidebarData.sort) {
      urlParams.set("sort", sidebarData.sort);
    }
    if (sidebarData.category && sidebarData.category !== "uncategorized") {
      urlParams.set("category", sidebarData.category);
    }

    const searchQuery = urlParams.toString();
    navigate(`/search${searchQuery ? `?${searchQuery}` : ""}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    try {
      const res = await fetch(`/api/v1/post/getblog?${searchQuery}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch more posts");
      }

      if (data.data && Array.isArray(data.data.posts)) {
        setPosts([...posts, ...data.data.posts]);
        setShowMore(data.data.posts.length >= 9);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="border-r border-gray-200 dark:border-gray-700 p-7 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="font-semibold whitespace-nowrap">
              Search Term:
            </label>
            <Input
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select
              onValueChange={(value) =>
                setSidebarData({ ...sidebarData, sort: value })
              }
              value={sidebarData.sort}
            >
              <SelectTrigger className="w-full mb-4 focus:outline-none dark:border-gray-700">
                <SelectValue placeholder="Select sorting order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Latest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onValueChange={(value) =>
                setSidebarData({ ...sidebarData, category: value })
              }
              value={sidebarData.category}
            >
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
                <SelectItem value="mental-health">Mental Health</SelectItem>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" variant="outline" className="gradient-duotone">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="p-3 mt-5 text-3xl font-semibold border-gray-200 dark:border-gray-700 sm:border-b">
          Posts results:
        </h1>
        <div className="flex flex-wrap gap-4 p-7">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {error && <p className="text-xl text-red-500">Error: {error}</p>}
          {!loading &&
            !error &&
            posts &&
            posts.map((post) => <BlogCard key={post._id} post={post} />)}
          {showMore && (
            <Button
              onClick={handleShowMore}
              variant="link"
              className="w-full text-lg text-teal-500 hover:underline p-7"
            >
              Show More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
