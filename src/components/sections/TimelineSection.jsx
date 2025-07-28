import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { getTimelineData } from '../../utils/contentLoader.js';
import './TimelineSection.css';

const TimelineSection = () => {
  const timelineData = getTimelineData();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "-100px" });
  
  // Scroll progress for animated timeline line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* Timeline Header Section - matching original structure */}
      <section id="timeline" className="h2---section---about">
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
            timeline<span style={{ color: '#f8cb74' }}>.</span>
          </motion.h2>
          <div className="h2---o about">
            <p className="paragraph text-lg md:text-xl font-medium text-gray-600">
              A journey of continuous evolution, learning, and meaningful impact
            </p>
          </div>
        </motion.a>
      </section>

      {/* Timeline Figure Section - matching original structure */}
      <figure className="timeline bg-white py-16" ref={containerRef}>
        <div className="timeline-container max-w-6xl mx-auto px-6">
          <div className="timeline_wrapper relative">
            {/* Timeline Progress Line */}
            <div className="timeline_progress absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300">
              <motion.div
                className="timeline_progress_bar w-full bg-blue-600 origin-top"
                style={{ height: progressHeight }}
              />
            </div>
            
            {/* Timeline Items */}
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                className="w-layout-grid timeline_items grid grid-cols-3 gap-8 items-center mb-12 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Timeline Left - Date */}
                <div className="timeline_left text-right">
                  <motion.div 
                    className="timeline_date_text text-gray-800"
                    whileHover={{ scale: 1.05, color: '#2563eb' }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.date}
                  </motion.div>
                </div>

                {/* Timeline Center - Circle */}
                <div className="timeline_center flex justify-center">
                  <motion.div 
                    className="timeline_circle w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg relative z-10"
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {/* Timeline Right - Content */}
                <div className="timeline_right">
                  <motion.div 
                    className="timeline_text text-gray-700 leading-relaxed"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p>{item.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </figure>
    </>
  );
};

export default TimelineSection;