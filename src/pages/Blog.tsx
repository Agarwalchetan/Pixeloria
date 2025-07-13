import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from '../components/SectionHeader';
import { Search, Calendar, User, ArrowRight, Star, TrendingUp, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogApi } from '../utils/api';

// Fallback data for when API is not available
const fallbackFeaturedPost = {
  _id: "fallback-0",
  title: "The Future of Web Development: AI, WebAssembly, and Edge Computing",
  excerpt: "Explore how emerging technologies are reshaping the web development landscape in 2025. From AI-powered development tools to edge computing solutions, discover what's next in tech.",
  image_url: "https://images.pexels.com/photos/8728285/pexels-photo-8728285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  author: "Sarah Johnson",
  createdAt: "2025-03-20T00:00:00.000Z",
  category: "Tech Trends",
  read_time: 8
};

const fallbackBlogPosts = [
  {
    _id: "fallback-1",
    title: "Building Scalable Web Apps in 2025",
    excerpt: "Explore the frontend and backend practices powering the next-gen web, from microservices to edge computing.",
    image_url: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Sarah Johnson",
    createdAt: "2025-03-15T00:00:00.000Z",
    category: "Web Development",
    read_time: 6
  },
  {
    _id: "fallback-2",
    title: "The Future of UI/UX: AI-Driven Design",
    excerpt: "Discover how artificial intelligence is revolutionizing the way we approach user interface and experience design.",
    image_url: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Mike Chen",
    createdAt: "2025-03-10T00:00:00.000Z",
    category: "UI/UX",
    read_time: 5
  },
  {
    _id: "fallback-3",
    title: "Optimizing eCommerce Performance",
    excerpt: "Learn the latest techniques for building high-performance online stores that convert visitors into customers.",
    image_url: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "Alex Rodriguez",
    createdAt: "2025-03-05T00:00:00.000Z",
    category: "eCommerce",
    read_time: 7
  }
];

const categories = [
  "All",
  "Web Development",
  "UI/UX",
  "eCommerce",
  "Tech Tools",
  "Tech Trends",
  "Pixeloria News"
];

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [featuredPost, setFeaturedPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await blogApi.getAll({ limit: 10 });
        
        if (response.success && response.data) {
          const posts = response.data.posts || [];
          setBlogPosts(posts);
          
          // Set the first post as featured, or use fallback
          if (posts.length > 0) {
            setFeaturedPost(posts[0]);
          } else {
            setFeaturedPost(fallbackFeaturedPost);
          }
        } else {
          throw new Error('Failed to fetch blog posts');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blog posts');
        
        // Use fallback data
        setBlogPosts(fallbackBlogPosts);
        setFeaturedPost(fallbackFeaturedPost);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const filteredPosts = selectedCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-600/20 border-l-4 border-yellow-400 p-4">
          <div className="container-custom">
            <p className="text-yellow-200 text-sm">
              <strong>Notice:</strong> {error}. Showing sample content.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/10 to-transparent"></div>
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Insights, Ideas & Innovation"
            subtitle="Explore the latest trends in web development, UI/UX design, and digital technology through the lens of the Pixeloria team."
          />

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12">
        <div className="container-custom">
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative aspect-video md:aspect-auto">
                  <img
                    src={featuredPost.image_url || featuredPost.image || 'https://images.pexels.com/photos/8728285/pexels-photo-8728285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent md:hidden"></div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="text-yellow-500" size={20} />
                    <span className="text-yellow-500 font-medium">Featured Post</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <User size={16} className="mr-1" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {formatDate(featuredPost.createdAt || featuredPost.date)}
                      </span>
                      <span className="flex items-center">
                        <BookOpen size={16} className="mr-1" />
                        {featuredPost.read_time || featuredPost.readTime} min read
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${featuredPost._id || featuredPost.id}`}
                    className="inline-flex items-center btn-primary group"
                  >
                    Read Article
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-8">
        <div className="container-custom">
          <div className="flex items-center space-x-4 mb-6">
            <TrendingUp className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-white">Trending Topics</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {['React 19', 'AI in Web Dev', 'WebAssembly', 'Edge Computing', 'Web Performance'].map((topic, index) => (
              <motion.button
                key={topic}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                #{topic}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Search Bar */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Blog Posts */}
              <div className="space-y-8">
                {filteredPosts.length > 0 ? filteredPosts.map((post, index) => (
                  <motion.article
                    key={post._id || post.id}
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-gray-800/50 rounded-xl overflow-hidden group hover:bg-gray-800 transition-all duration-300"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={post.image_url || post.image || 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                          alt={post.title}
                          className="h-48 w-full object-cover md:h-full transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <span className="text-blue-400 font-medium text-sm">
                          {post.category}
                        </span>
                        <h3 className="text-xl font-bold mt-2 mb-3 text-white group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <User size={16} className="mr-1" />
                              {post.author}
                            </span>
                            <span className="flex items-center">
                              <Calendar size={16} className="mr-1" />
                              {formatDate(post.createdAt || post.date)}
                            </span>
                            <span className="flex items-center">
                              <BookOpen size={16} className="mr-1" />
                              {post.read_time || post.readTime} min read
                            </span>
                          </div>
                          <Link
                            to={`/blog/${post._id || post.id}`}
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center group/link"
                          >
                            Read More
                            <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                )) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No blog posts found for the selected category.</p>
                  </div>
                )}
              </div>

              {/* Load More Button */}
              <div className="mt-12 text-center">
                <button className="btn-outline">
                  Load More Articles
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Categories */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
                <p className="mb-4">Get the latest insights delivered to your inbox</p>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-md mb-3 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button className="w-full bg-white text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
                  Subscribe
                </button>
              </div>

              {/* CTA Box */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-white">Need Web Development?</h3>
                <p className="text-gray-400 mb-4">
                  Turn your ideas into reality with our expert web development services.
                </p>
                <Link
                  to="/contact"
                  className="btn-primary w-full justify-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;