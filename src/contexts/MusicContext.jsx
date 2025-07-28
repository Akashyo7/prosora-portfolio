import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Custom tracks for portfolio experience
  const tracks = [
    {
      id: 1,
      title: "Ay Hairathe",
      artist: "A.R. Rahman, Hariharan",
      // Primary source: Local karaoke file (webm format from YouTube)
      src: "/music/ay-hairathe-karaoke.webm",
      // Fallback: Beautiful Indian classical-inspired instrumental
      fallbackSrc: "https://www.bensound.com/bensound-music/bensound-india.mp3",
      // Alternative fallbacks for different moods
      alternativeSources: [
        "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
        "https://www.bensound.com/bensound-music/bensound-memories.mp3"
      ],
      duration: 280, // Approximate duration for Ay Hairathe (4:40)
      type: "karaoke",
      description: "Karaoke version of the beautiful song by A.R. Rahman and Hariharan",
      movie: "Guru (2007)",
      language: "Hindi",
      status: "loaded" // File successfully downloaded from YouTube
    },
    {
      id: 2,
      title: "Portfolio Ambient",
      artist: "Akash's Collection",
      src: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
      duration: 146,
      type: "ambient"
    },
    {
      id: 3,
      title: "Focus Flow",
      artist: "Background Vibes",
      src: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
      duration: 142,
      type: "ambient"
    }
  ];

  // Initialize audio element with fallback support
  useEffect(() => {
    if (currentTrack && !audioRef.current) {
      const initializeAudio = (src) => {
        audioRef.current = new Audio(src);
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.loop = true; // Loop the background music
        
        // Audio event listeners
        audioRef.current.addEventListener('loadstart', () => setIsLoading(true));
        audioRef.current.addEventListener('canplay', () => setIsLoading(false));
        audioRef.current.addEventListener('error', () => {
          console.warn(`❌ Failed to load: ${src}`);
          // Try fallback if available
          if (currentTrack.fallbackSrc && src !== currentTrack.fallbackSrc) {
            console.log(`🔄 Trying fallback: ${currentTrack.fallbackSrc}`);
            audioRef.current = null;
            initializeAudio(currentTrack.fallbackSrc);
          } else {
            setError(`Failed to load ${currentTrack.title}`);
            setIsLoading(false);
            console.error(`❌ No fallback available for ${currentTrack.title}`);
          }
        });
        
        audioRef.current.addEventListener('loadeddata', () => {
          console.log(`✅ Successfully loaded: ${currentTrack.title}`);
        });
      };
      
      initializeAudio(currentTrack.src);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrack, volume, isMuted]);

  // Play music
  const play = async () => {
    if (!currentTrack) {
      setCurrentTrack(tracks[0]); // Default to first track
      return;
    }

    if (audioRef.current) {
      try {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      } catch (err) {
        setError('Failed to play audio');
        console.error('Audio play error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Pause music
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle play/pause
  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Mute/unmute functionality
  const mute = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const unmute = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  // Change volume
  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Change track
  const changeTrack = (trackId) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setCurrentTrack(track);
      setIsPlaying(false);
    }
  };

  // Auto-start music seamlessly after headphone animation
  const startAfterAnimation = () => {
    // Pre-load the track immediately
    if (!currentTrack) {
      console.log('🎵 Pre-loading track: Ay Hairathe');
      setCurrentTrack(tracks[0]);
    }
    
    // Start music exactly when headphone animation completes (seamless timing)
    setTimeout(() => {
      console.log('🎵 Starting seamless playback:', currentTrack?.title || tracks[0].title);
      play();
    }, 6200); // Perfectly timed with headphone animation completion
  };

  const value = {
    isPlaying,
    currentTrack,
    volume,
    isLoading,
    error,
    isMuted,
    tracks,
    play,
    pause,
    toggle,
    mute,
    unmute,
    toggleMute,
    changeVolume,
    changeTrack,
    startAfterAnimation
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};