#!/bin/bash

echo "🎵 Music File Status Checker"
echo "============================"

MUSIC_DIR="../public/music"
KARAOKE_MP3="$MUSIC_DIR/ay-hairathe-karaoke.mp3"
KARAOKE_WEBM="$MUSIC_DIR/ay-hairathe-karaoke.webm"

if [ -f "$KARAOKE_MP3" ] || [ -f "$KARAOKE_WEBM" ]; then
    if [ -f "$KARAOKE_WEBM" ]; then
        KARAOKE_FILE="$KARAOKE_WEBM"
    else
        KARAOKE_FILE="$KARAOKE_MP3"
    fi
    echo "✅ Ay Hairathe karaoke file found!"
    echo "📁 Location: $KARAOKE_FILE"
    
    # Get file size
    SIZE=$(ls -lh "$KARAOKE_FILE" | awk '{print $5}')
    echo "📊 File size: $SIZE"
    
    # Check if it's a valid audio file
    if file "$KARAOKE_FILE" | grep -q "audio"; then
        echo "🎶 File appears to be valid audio"
    else
        echo "⚠️  File might not be valid audio"
    fi
    
    echo ""
    echo "🚀 Your karaoke track is ready to use!"
    echo "   Just refresh your browser to hear it play."
    
else
    echo "❌ Ay Hairathe karaoke file not found"
    echo "📁 Expected locations: $KARAOKE_MP3 or $KARAOKE_WEBM"
    echo ""
    echo "📋 To add the file:"
    echo "1. Download 'Ay Hairathe karaoke' from YouTube or music service"
    echo "2. Rename it to: ay-hairathe-karaoke.mp3"
    echo "3. Place it in: $MUSIC_DIR/"
    echo ""
    echo "🔄 Currently using fallback track: Indian classical instrumental"
fi

echo ""
echo "📂 Music directory contents:"
ls -la "$MUSIC_DIR" 2>/dev/null || echo "   (directory empty or doesn't exist)"