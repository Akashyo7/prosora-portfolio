import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getPersonalInfo } from '../../utils/contentLoader.js';

const Footer = () => {
  const personalInfo = getPersonalInfo();



  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(147,51,234,0.3),transparent_50%)]" />
      </div>
    </footer>
  );
};

export default Footer;