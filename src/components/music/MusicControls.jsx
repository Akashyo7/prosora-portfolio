import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../../contexts/MusicContext';

const MusicControls = ({ show = false }) => {
  const { isPlaying, currentTrack, volume, isLoading, toggle, changeVolume } = useMusic();
  const [showControls, setShowControls] = useState(false);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Main Music Button */}
        <motion.div
          className="relative"
          onHoverStart={() => setShowControls(true)}
          onHoverEnd={() => setShowControls(false)}
        >
          {/* Primary Control Button */}
          <motion.button
            onClick={toggle}
            className="w-16 h-16 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : isPlaying ? (
              // Pause Icon
              <div className="flex space-x-1">
                <div className="w-1.5 h-6 bg-white rounded"></div>
                <div className="w-1.5 h-6 bg-white rounded"></div>
              </div>
            ) : (
              // Play Icon
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            )}
          </motion.button>

          {/* Expanded Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute bottom-20 right-0 bg-white rounded-lg shadow-xl p-4 min-w-[200px]"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {/* Track Info */}
                {currentTrack && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm">{currentTrack.title}</h4>
                    <p className="text-gray-600 text-xs">{currentTrack.artist}</p>
                  </div>
                )}

                {/* Volume Control */}
                <div className="mb-4">
                  <label className="block text-xs text-gray-600 mb-2">Volume</label>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM16 8a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => changeVolume(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 w-8">{Math.round(volume * 100)}%</span>
                  </div>
                </div>

                {/* Status */}
                <div className="text-xs text-gray-500">
                  {isPlaying ? '🎵 Playing' : '⏸️ Paused'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Audio Visualizer Ring */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MusicControls;