import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWorkData } from '../../utils/contentLoader.js';
import './WorkSection.css';

// Simple image URL handler - no encoding needed with clean filenames
const getImageUrl = (originalUrl) => {
  return originalUrl;
};

const WorkSection = () => {
  const workData = getWorkData();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Simple navigation - pairs of projects
  const totalSlides = Math.ceil(workData.length / 2);
  
  // Auto-play functionality - simple and clean
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };
  
  return (
    <section className="work bg-white py-20">
      <div className="container mx-auto px-6">
        {/* Section Header - Matching About/Story Style */}
        <section id="work" className="h2---section---about">
          <motion.a 
            href="#"
            className="h2---link-block w-inline-block block text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="h2---text text-black mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              my work<span style={{ color: '#f8cb74' }}>.</span>
            </motion.h2>
            <div className="h2---o about">
              <p className="paragraph text-lg md:text-xl font-medium text-gray-600">
                A collection of product and marketing case studies
              </p>
            </div>
          </motion.a>
        </section>

        {/* Layered Structure - Background + Cards + Navigation */}
        <div className="work-container relative">
          {/* Background Layer */}
          <div className="work-background absolute inset-0 -z-10"></div>
          
          {/* Cards Layer - Uniform Structure with Smart Placeholder */}
          <div className="work-cards-container max-w-7xl mx-auto px-4 py-12">
            <div className="work-grid grid grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {(() => {
                const currentProjects = workData.slice(currentSlide * 2, currentSlide * 2 + 2);
                const needsPlaceholder = currentProjects.length === 1;
                
                return (
                  <>
                    {currentProjects.map((project) => (
                      <div key={project.id} className="work-card">
                        <a
                          href={project.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="work-card-link block group"
                        >
                          {/* Uniform Image Container */}
                          <div className="work-image-container">
                            <div className="work-image-wrapper">
                              <img
                                src={getImageUrl(project.imageUrl)}
                                alt={project.title}
                                className="work-image"
                                loading="lazy"
                                onLoad={() => {
                                  console.log('✅ Image loaded successfully:', project.title);
                                }}
                                onError={(e) => {
                                  console.log('❌ Image failed to load:', project.title);
                                  console.log('   Original URL:', project.imageUrl);
                                  console.log('   Processed URL:', getImageUrl(project.imageUrl));
                                  console.log('   Attempted src:', e.target.src);
                                  
                                  // Show placeholder immediately
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="work-image-placeholder">
                                      <div class="placeholder-content">
                                        <div class="placeholder-icon">📊</div>
                                        <div class="placeholder-text">${project.title}</div>
                                      </div>
                                    </div>
                                  `;
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Uniform Typography Container */}
                          <div className="work-text-container">
                            <div className="work-project-type">
                              {project.type}
                            </div>
                            <div className="work-project-title">
                              "{project.title}"
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                    
                    {/* Smart Placeholder Card - Only when needed */}
                    {needsPlaceholder && (
                      <div className="work-card work-placeholder-card">
                        <div className="work-card-link block group cursor-default">
                          {/* Placeholder Image Container */}
                          <div className="work-image-container">
                            <div className="work-image-wrapper">
                              <div className="work-image-placeholder work-smart-placeholder">
                                <div className="placeholder-content">
                                  <div className="placeholder-icon">✨</div>
                                  <div className="placeholder-text">More Coming Soon</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Placeholder Typography Container */}
                          <div className="work-text-container">
                            <div className="work-project-type work-placeholder-type">
                              UPCOMING PROJECT
                            </div>
                            <div className="work-project-title work-placeholder-title">
                              "Stay Tuned"
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>

          {/* Descriptions Layer - Between Cards and Navigation */}
          <div className="work-descriptions">
            <div className="work-descriptions-container">
              {(() => {
                const currentProjects = workData.slice(currentSlide * 2, currentSlide * 2 + 2);
                const needsPlaceholder = currentProjects.length === 1;
                
                return (
                  <div className="work-descriptions-grid">
                    {currentProjects.map((project) => (
                      <div key={`desc-${project.id}`} className="work-description">
                        <p className="work-description-text">
                          {project.description}
                        </p>
                      </div>
                    ))}
                    
                    {/* Smart Placeholder Description - Only when needed */}
                    {needsPlaceholder && (
                      <div className="work-description work-placeholder-description">
                        <p className="work-description-text work-placeholder-description-text">
                          More exciting case studies and projects coming soon to showcase innovative solutions and strategic insights.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Navigation Layer - Small Elegant Dots */}
          <div className="work-navigation">
            <div className="work-dots-container">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`work-dot ${currentSlide === index ? 'work-dot-active' : ''}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;