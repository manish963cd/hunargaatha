'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { stories } from '@/data/stories';
import { notFound } from 'next/navigation';

export default function StoryPage({ params }) {
  const story = stories.find(s => s.slug === params.slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-orange-600">Home</Link></li>
            <li>•</li>
            <li><Link href="/stories" className="hover:text-orange-600">Stories</Link></li>
            <li>•</li>
            <li className="text-gray-900">{story.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{story.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>By {story.author}</span>
              <span>•</span>
              <span>{story.readTime}</span>
              <span>•</span>
              <span>{new Date(story.publishDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                {story.district}
              </span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {story.craft}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={story.images[0]}
              alt={story.title}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="text-lg leading-relaxed text-gray-700 space-y-6">
            {story.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {/* Additional Images */}
          {story.images.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              {story.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${story.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 bg-orange-50 p-8 rounded-lg text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Support This Craft</h3>
          <p className="text-gray-600 mb-6">
            Discover products created by artisans like {story.author} and help preserve traditional crafts.
          </p>
          <div className="space-x-4">
            <Link
              href={`/shop`}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 inline-block"
            >
              Shop {story.craft} Products
            </Link>
            <Link
              href={`/crafts/${story.craft.toLowerCase().replace(' ', '-')}`}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold border-2 border-orange-600 hover:bg-orange-50 transition-colors duration-200 inline-block"
            >
              Learn More About {story.craft}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}