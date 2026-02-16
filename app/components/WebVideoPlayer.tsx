// Alternative video player using WebView (guaranteed to work if URL plays in browser)
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebVideoPlayerProps {
  uri: string;
}

export const WebVideoPlayer = ({ uri }: WebVideoPlayerProps) => {
  const [loading, setLoading] = React.useState(true);

  // HTML template with video player
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
          }
          video {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <video 
          controls 
          playsinline
          preload="metadata"
          src="${uri}"
        >
          Your browser does not support the video tag.
        </video>
      </body>
    </html>
  `;

  return (
    <View className='w-full h-64 bg-dark-200 rounded-lg overflow-hidden relative'>
      <WebView
        source={{ html: htmlContent }}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={{ backgroundColor: 'transparent' }}
      />
      
      {loading && (
        <View className='absolute inset-0 justify-center items-center bg-dark-300'>
          <ActivityIndicator size="large" color="#AB8BFF" />
          <Text className='text-light-300 mt-2'>Loading player...</Text>
        </View>
      )}
    </View>
  );
};