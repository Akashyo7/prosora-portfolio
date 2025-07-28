#!/bin/bash

# Music Download Helper Script
# This script helps you download the Ay Hairathe karaoke track

echo "🎵 Ay Hairathe Karaoke Download Helper"
echo "======================================"

# Check if yt-dlp is installed
if command -v yt-dlp &> /dev/null; then
    echo "✅ yt-dlp found"
    
    echo "🔍 Searching for Ay Hairathe karaoke versions..."
    echo "Please manually search YouTube for:"
    echo "  - 'Ay Hairathe karaoke'"
    echo "  - 'Ay Hairathe instrumental'"
    echo "  - 'Guru movie Ay Hairathe karaoke'"
    
    echo ""
    echo "Once you find a good version, copy the URL and run:"
    echo "yt-dlp -x --audio-format mp3 'YOUR_YOUTUBE_URL_HERE'"
    echo ""
    echo "Then rename the file to: ay-hairathe-karaoke.mp3"
    echo "And move it to: ../public/music/"
    
else
    echo "❌ yt-dlp not found"
    echo "Install it with: pip install yt-dlp"
    echo "Or use online YouTube to MP3 converters"
fi

echo ""
echo "📁 Target location: $(pwd)/../public/music/ay-hairathe-karaoke.mp3"
echo ""
echo "🎯 Alternative approach:"
echo "1. Go to YouTube and search 'Ay Hairathe karaoke'"
echo "2. Use any YouTube to MP3 converter"
echo "3. Download and rename to 'ay-hairathe-karaoke.mp3'"
echo "4. Place in public/music/ folder"
echo ""
echo "✨ The system will automatically detect and use your file!"