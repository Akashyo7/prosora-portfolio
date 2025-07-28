import { motion } from 'framer-motion';
import { getAboutInfo } from '../../utils/contentLoader.js';
import './AboutSection.css';

const AboutSection = () => {
  const aboutInfo = getAboutInfo();

  return (
    <>
      {/* About Header Section - matching original structure */}
      <section id="About" className="h2---section---about">
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
            about<span style={{ color: '#f8cb74' }}>.</span>
          </motion.h2>
          <div className="h2---o about">
            <p className="paragraph font-medium" style={{ color: '#f8cb74' }}>
              A bit about me here
            </p>
          </div>
        </motion.a>
      </section>

      {/* About Content Section - matching original structure */}
      <section className="about-section bg-white py-12 md:py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-block-3 text-lg md:text-xl leading-relaxed text-gray-700">
              {aboutInfo.prosora.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-6"
                >
                  {paragraph.includes('connect') ? (
                    <>
                      {paragraph.split('connect')[0]}
                      <motion.a
                        href="#Contact"
                        className="text-blue-600 hover:text-blue-800 underline font-medium"
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        connect
                      </motion.a>
                      {paragraph.split('connect')[1]}
                    </>
                  ) : (
                    paragraph
                  )}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;