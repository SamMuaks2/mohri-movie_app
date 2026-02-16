// Smart video player that tries expo-av first, falls back to WebView
import { icons } from '@/constants/icons';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface HybridVideoPlayerProps {
  uri: string;
}

export const HybridVideoPlayer = ({ uri }: HybridVideoPlayerProps) => {
  const [useWebView, setUseWebView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = React.useRef<Video>(null);

  const handleError = (error: string) => {
    console.error('❌ Native video player failed:', error);
    console.log('🔄 Switching to WebView player...');
    setUseWebView(true);
    setHasError(false);
  };

  const handleLoad = (status: AVPlaybackStatus) => {
    console.log('✅ Video loaded!');
    setIsLoading(false);
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
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
        <video controls playsinline preload="metadata" src="${uri}">
          Your browser does not support the video tag.
        </video>
      </body>
    </html>
  `;

  if (useWebView) {
    return (
      <View className='w-full h-64 bg-dark-200 rounded-lg overflow-hidden relative'>
        <WebView
          source={{ html: htmlContent }}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          style={{ backgroundColor: 'transparent' }}
        />
        
        {isLoading && (
          <View className='absolute inset-0 justify-center items-center bg-dark-300'>
            <ActivityIndicator size="large" color="#AB8BFF" />
            <Text className='text-light-300 mt-2'>Loading player...</Text>
          </View>
        )}

        {/* WebView indicator */}
        <View className='absolute top-2 right-2 bg-dark-300/80 px-2 py-1 rounded'>
          <Text className='text-light-400 text-xs'>WebView Mode</Text>
        </View>
      </View>
    );
  }

  return (
    <View className='w-full h-64 bg-dark-200 rounded-lg overflow-hidden relative'>
      <Video
        ref={videoRef}
        source={{ uri }}
        className='w-full h-full'
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        onLoadStart={() => {
          console.log('🎬 Loading video...');
          setIsLoading(true);
        }}
        onLoad={handleLoad}
        onError={(error) => handleError(error || 'Unknown error')}
        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
          if (!status.isLoaded && status.error) {
            handleError(status.error);
          }
        }}
      />

      {isLoading && !hasError && (
        <View className='absolute inset-0 justify-center items-center bg-dark-300/90'>
          <ActivityIndicator size="large" color="#AB8BFF" />
          <Text className='text-light-300 mt-2'>Loading video...</Text>
        </View>
      )}

      {hasError && !useWebView && (
        <View className='absolute inset-0 justify-center items-center bg-dark-300 px-5'>
          <Image source={icons.play} className='size-12 mb-2' tintColor='#FF6B6B' />
          <Text className='text-light-100 text-center font-bold'>
            Native Player Failed
          </Text>
          <TouchableOpacity
            onPress={() => setUseWebView(true)}
            className='bg-accent px-6 py-2 rounded-full mt-4'
          >
            <Text className='text-white font-bold'>Switch to WebView</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Manual switch option */}
      <TouchableOpacity
        onPress={() => setUseWebView(true)}
        className='absolute bottom-2 right-2 bg-dark-300/80 px-2 py-1 rounded'
      >
        <Text className='text-light-400 text-xs'>Use WebView</Text>
      </TouchableOpacity>
    </View>
  );
};