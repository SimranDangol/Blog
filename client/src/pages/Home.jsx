/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen text-gray-900 bg-white dark:bg-gray-950 dark:text-gray-100">
      {/* Hero Section with Animation */}
      <motion.section
        className="flex flex-col items-center px-4 py-20 mx-auto space-y-8 text-center sm:px-6 max-w-7xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
          A Platform for Ideas and Insights
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
          Dive into articles across technology, lifestyle, and creativity,
          crafted to spark new perspectives.
        </p>
        <Link to="/blogs">
          <Button
            variant="outline"
            size="lg"
            className="text-teal-600 transition-all duration-200 border-2 border-teal-600 dark:border-teal-400 dark:text-teal-400 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-400 dark:hover:text-gray-900"
          >
            Explore Blogs
          </Button>
        </Link>
      </motion.section>

      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      </div>

      {/* Featured Topics Section with Animation */}
      <motion.section
        className="px-4 py-20 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h2 className="mb-12 text-3xl font-bold text-center text-transparent sm:text-4xl bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
          Featured Categories
        </h2>
        <div className="grid gap-6 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl">
          {[
            "Technology",
            "Lifestyle",
            "Travel",
            "Business",
            "Health",
            "Food",
            "Sports",
            "Education",
          ].map((topic, index) => (
            <motion.div
              key={index}
              className="p-6 text-center transition-all duration-200 bg-white border border-gray-200 shadow-sm group rounded-xl dark:border-gray-800 dark:bg-gray-900 hover:shadow-md dark:shadow-gray-900/50 hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="mb-3 text-xl font-semibold text-teal-600 dark:text-teal-400 group-hover:text-teal-500 dark:group-hover:text-teal-300">
                {topic}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explore the latest in {topic.toLowerCase()} from our community
                of contributors.
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
      </div>

      {/* Call to Action Section with Animation */}
      <motion.section
        className="flex flex-col items-center px-4 py-20 mx-auto space-y-8 sm:px-6 max-w-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-transparent sm:text-4xl bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
          Ready to Dive In?
        </h2>
        <p className="max-w-2xl text-lg leading-relaxed text-center text-gray-600 dark:text-gray-300">
          Immerse yourself in captivating stories, insightful perspectives, and
          ideas waiting to be explored. Dive into the world of writing today!
        </p>
        
        {/* Added horizontal line */}
        <div className="w-24 h-1 mx-auto my-6 bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400" />

        <Link to="/create-blog">
          <Button
            size="lg"
            className="text-white transition-opacity duration-200 bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 dark:text-gray-900 hover:opacity-90"
          >
            Start Writing
          </Button>
        </Link>
      </motion.section>
    </div>
  );
}
