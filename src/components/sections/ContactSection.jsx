import { motion } from 'framer-motion';
import { getPersonalInfo } from '../../utils/contentLoader.js';
import './ContactSection.css';

const ContactSection = () => {
  const personalInfo = getPersonalInfo();

  return (
    <>
      {/* Contact Header Section - Minimal Style with Proper Spacing */}
      <section id="contact" className="h2---section---about contact-section-spacing">
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
            contact<span style={{ color: '#f8cb74' }}>.</span>
          </motion.h2>
          <div className="h2---o about">
            <p className="paragraph font-medium" style={{ color: '#f8cb74' }}>
              Let's turn ideas into impact
            </p>
          </div>
        </motion.a>
      </section>

      {/* Contact Form Section - matching original structure */}
      <section className="section---contact-form bg-white py-12 md:py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <p className="paragraph-cf text-lg md:text-xl text-gray-700 mb-4">
              Contact me at{' '}
            </p>
            
            <motion.a
              href={`mailto:${personalInfo.email}?subject=Connect via Prosora`}
              className="link-block-cf w-inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-2xl md:text-3xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6">
                {personalInfo.email}
              </p>
            </motion.a>
            
            <p className="paragraph-cf text-lg md:text-xl text-gray-700">
              or hit me up on{' '}
              <motion.a
                href="https://www.linkedin.com/in/aka-shy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Linkedin
              </motion.a>
              {' '}or{' '}
              <motion.a
                href="https://www.facebook.com/profile.php?id=100005669528044&sk=about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
                whileHover={{ scale: 1.05 }}
              >
                Fb
              </motion.a>
            </p>
          </motion.div>
        </div>
      </section>



      {/* Footer Copyright */}
      <motion.div
        className="footer---copyright bg-white py-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p className="text-gray-600 text-sm leading-relaxed">
          Created from scratch with Inspiration !<br />
          <br />
          © Akash Yadav 2025<br />
          <br />
        </p>
      </motion.div>
    </>
  );
};

export default ContactSection;