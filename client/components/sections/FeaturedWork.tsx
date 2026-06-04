import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface WorkProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  result?: string;
  clientOrder?: string;
}

interface FeaturedWorkProps {
  heading: string;
  subheading: string;
  projects: WorkProject[];
}

export default function FeaturedWork({
  heading,
  subheading,
  projects,
}: FeaturedWorkProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardSliderIndex, setCardSliderIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const hasMoreThanThree = projects.length > 3;
  const cardsPerView = 3;
  const cardWidth = 100 / cardsPerView; // Each card is 1/3 of the container width

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Auto-scroll slider when activeIndex changes
  useEffect(() => {
    if (hasMoreThanThree) {
      const maxIndex = Math.max(0, projects.length - cardsPerView);

      // If active index is before the current view, scroll back
      if (activeIndex < cardSliderIndex) {
        setCardSliderIndex(Math.max(0, activeIndex));
      }
      // If active index is after the current view, scroll forward
      else if (activeIndex >= cardSliderIndex + cardsPerView) {
        setCardSliderIndex(Math.min(maxIndex, activeIndex - cardsPerView + 1));
      }
    }
  }, [activeIndex, cardSliderIndex, hasMoreThanThree, projects.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!hasMoreThanThree) return;
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !hasMoreThanThree) return;
    const distance = e.clientX - dragStart;
    if (sliderRef.current) {
      const percentage = (distance / sliderRef.current.offsetWidth) * 100;
      setDragOffset(percentage);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !hasMoreThanThree) return;
    setIsDragging(false);
    handleDragEnd(dragOffset);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMoreThanThree) return;
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !hasMoreThanThree) return;
    const distance = e.touches[0].clientX - dragStart;
    if (sliderRef.current) {
      const percentage = (distance / sliderRef.current.offsetWidth) * 100;
      setDragOffset(percentage);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !hasMoreThanThree) return;
    setIsDragging(false);
    handleDragEnd(dragOffset);
  };

  const handleDragEnd = (percentage: number) => {
    const threshold = 5; // Minimum percentage to trigger a slide (5% of container width)
    const maxIndex = Math.max(0, projects.length - cardsPerView);

    if (Math.abs(percentage) > threshold) {
      if (percentage > 0) {
        // Dragged right - show previous cards
        setCardSliderIndex(Math.max(0, cardSliderIndex - 1));
      } else {
        // Dragged left - show next cards
        setCardSliderIndex(Math.min(maxIndex, cardSliderIndex + 1));
      }
    }
    setDragOffset(0);
  };

  const activeProject = projects[activeIndex];

  // Helper function to truncate description to 8 words
  const truncateDescription = (text: string, wordLimit: number = 8): string => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <section id="work" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subheading}
          </p>
        </motion.div>

        {/* Featured Project Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16 bg-white rounded-3xl shadow-xl p-8 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-gray-200 h-96"
            >
              <img
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              key={`content-${activeProject.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Client Order Pill */}
              {activeProject.clientOrder && (
                <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {activeProject.clientOrder}
                </div>
              )}

              <h3 className="text-3xl font-semibold text-gray-900 mb-3">
                {activeProject.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 text-lg">
                {activeProject.description}
              </p>

              {/* Technologies Used */}
              <p className="text-lg font-bold text-gray-900 mb-2">Technologies Used:</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {activeProject.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm font-normal"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Result */}
              {activeProject.result && (
                <div className="flex items-start gap-2 mb-8 text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-lg font-medium">{activeProject.result}</span>
                </div>
              )}

              <motion.a
                href={activeProject.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                View Project
              </motion.a>
            </motion.div>
          </div>

          {/* Navigation and Indicators - Arrows with Dots */}
          <div className="flex items-center justify-between gap-6 mt-12">
            {/* Left Arrow */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevProject}
              className="p-2 text-gray-900 hover:text-gray-700 transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft size={24} />
            </motion.button>

            {/* Center Dots */}
            <div className="flex justify-center gap-2">
              {projects.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeIndex
                      ? "w-8 bg-gray-900"
                      : "w-2 bg-gray-400 hover:bg-gray-600"
                  }`}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextProject}
              className="p-2 text-gray-900 hover:text-gray-700 transition-colors"
              aria-label="Next project"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Projects Grid or Slider */}
        {hasMoreThanThree ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Slider container */}
            <div
              ref={sliderRef}
              className="overflow-hidden select-none cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.div
                animate={{
                  x: `${isDragging
                    ? dragOffset
                    : -cardSliderIndex * cardWidth}%`,
                }}
                transition={isDragging ? { type: "tween", duration: 0 } : { duration: 0.5, ease: "easeInOut" }}
                className="flex gap-6"
              >
                {projects.map((project, idx) => (
                  <motion.a
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setActiveIndex(idx)}
                    whileHover={{ y: -8 }}
                    className={`flex-shrink-0 w-full md:w-1/3 group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 cursor-pointer flex flex-col justify-between ${
                      idx === activeIndex ? "border-blue-600" : "border-transparent"
                    }`}
                  >
                    {/* Image */}
                    <div className="h-40 bg-gray-300 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        {/* Category without background */}
                        {project.clientOrder && (
                          <p className="text-xs text-gray-600 font-medium mb-2">
                            {project.clientOrder}
                          </p>
                        )}

                        {/* Title */}
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h4>

                        {/* Description - 8 words */}
                        <p className="text-sm text-gray-600 mb-3">
                          {truncateDescription(project.description)}
                        </p>
                      </div>

                      {/* Result */}
                      {project.result && (
                        <div className="flex items-center gap-2 pt-2 text-green-600 text-sm font-medium">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                          <span>{project.result}</span>
                        </div>
                      )}
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {projects.map((project, idx) => (
              <motion.a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveIndex(idx)}
                whileHover={{ y: -8 }}
                className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 cursor-pointer flex flex-col justify-between ${
                  idx === activeIndex ? "border-blue-600" : "border-transparent"
                }`}
              >
                {/* Image */}
                <div className="h-40 bg-gray-300 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* Category without background */}
                    {project.clientOrder && (
                      <p className="text-xs text-gray-600 font-medium mb-2">
                        {project.clientOrder}
                      </p>
                    )}

                    {/* Title */}
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h4>

                    {/* Description - 8 words */}
                    <p className="text-sm text-gray-600 mb-3">
                      {truncateDescription(project.description)}
                    </p>
                  </div>

                  {/* Result */}
                  {project.result && (
                    <div className="flex items-center gap-2 pt-2 text-green-600 text-sm font-medium">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                      <span>{project.result}</span>
                    </div>
                  )}
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
