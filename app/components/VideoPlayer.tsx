import { icons } from '@/constants/icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

interface VideoPlayerProps {
  uri: string;
  onError?: (error: string) => void;
  onLoadStart?: () => void;
  onLoad?: () => void;
}

export const VideoPlayer = ({ uri, onError, onLoadStart, onLoad }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [status, setStatus] = useState<any>({});
  const videoRef = React.useRef<Video>(null);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    onLoadStart?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (error: string) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(error);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        videoRef.current.pauseAsync();
      } else {
        videoRef.current.playAsync();
      }
    }
  };

  return (
    <View className='w-full h-64 bg-dark-200 rounded-lg overflow-hidden relative'>
      <Video
        ref={videoRef}
        source={{ uri }}
        className='w-full h-full'
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={() => handleError('Failed to load video')}
        onPlaybackStatusUpdate={status => setStatus(status)}
      />

      {isLoading && (
        <View className='absolute inset-0 justify-center items-center bg-dark-300'>
          <ActivityIndicator size="large" color="#AB8BFF" />
          <Text className='text-light-300 mt-2'>Loading video...</Text>
        </View>
      )}

      {hasError && (
        <View className='absolute inset-0 justify-center items-center bg-dark-300 px-5'>
          <Image source={icons.play} className='size-12 mb-2' tintColor='#AB8BFF' />
          <Text className='text-light-100 text-center'>
            Unable to load video
          </Text>
          <Text className='text-light-300 text-sm text-center mt-1'>
            This movie may not be available for streaming
          </Text>
        </View>
      )}
    </View>
  );
};