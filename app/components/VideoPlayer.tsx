// import { icons } from '@/constants/icons';
// import { ResizeMode, Video } from 'expo-av';
// import React, { useState } from 'react';
// import { ActivityIndicator, Image, Text, View } from 'react-native';

// interface VideoPlayerProps {
//   uri: string;
//   onError?: (error: string) => void;
//   onLoadStart?: () => void;
//   onLoad?: () => void;
// }

// export const VideoPlayer = ({ uri, onError, onLoadStart, onLoad }: VideoPlayerProps) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasError, setHasError] = useState(false);
//   const [status, setStatus] = useState<any>({});
//   const videoRef = React.useRef<Video>(null);

//   const handleLoadStart = () => {
//     setIsLoading(true);
//     setHasError(false);
//     onLoadStart?.();
//   };

//   const handleLoad = () => {
//     setIsLoading(false);
//     onLoad?.();
//   };

//   const handleError = (error: string) => {
//     setIsLoading(false);
//     setHasError(true);
//     onError?.(error);
//   };

//   const togglePlayPause = () => {
//     if (videoRef.current) {
//       if (status.isPlaying) {
//         videoRef.current.pauseAsync();
//       } else {
//         videoRef.current.playAsync();
//       }
//     }
//   };

//   return (
//     <View className='w-full h-64 bg-dark-200 rounded-lg overflow-hidden relative'>
//       <Video
//         ref={videoRef}
//         source={{ uri }}
//         className='w-full h-full'
//         useNativeControls
//         resizeMode={ResizeMode.CONTAIN}
//         shouldPlay={false}
//         onLoadStart={handleLoadStart}
//         onLoad={handleLoad}
//         onError={() => handleError('Failed to load video')}
//         onPlaybackStatusUpdate={status => setStatus(status)}
//       />

//       {isLoading && (
//         <View className='absolute inset-0 justify-center items-center bg-dark-300'>
//           <ActivityIndicator size="large" color="#AB8BFF" />
//           <Text className='text-light-300 mt-2'>Loading video...</Text>
//         </View>
//       )}

//       {hasError && (
//         <View className='absolute inset-0 justify-center items-center bg-dark-300 px-5'>
//           <Image source={icons.play} className='size-12 mb-2' tintColor='#AB8BFF' />
//           <Text className='text-light-100 text-center'>
//             Unable to load video
//           </Text>
//           <Text className='text-light-300 text-sm text-center mt-1'>
//             This movie may not be available for streaming
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// };




// Enhanced video player with debugging and error handling
import { icons } from '@/constants/icons';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

interface VideoPlayerProps {
  uri: string;
  onError?: (error: string) => void;
  onLoadStart?: () => void;
  onLoad?: () => void;
}

export const VideoPlayer = ({ uri, onError, onLoadStart, onLoad }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const handleLoadStart = () => {
    console.log('🎬 Video loading started:', uri);
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    onLoadStart?.();
  };

  const handleLoad = (status: AVPlaybackStatus) => {
    console.log('✅ Video loaded successfully!', status);
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (error: string) => {
    console.error('❌ Video error:', error);
    console.error('Failed URL:', uri);
    setIsLoading(false);
    setHasError(true);
    setErrorMessage(error);
    onError?.(error);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      
      // Log buffering status
      if (status.isBuffering) {
        console.log('⏳ Video buffering...');
      }
    } else if (status.error) {
      handleError(status.error);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const retryLoad = () => {
    console.log('🔄 Retrying video load...');
    setHasError(false);
    setIsLoading(true);
    videoRef.current?.loadAsync({ uri }, {}, false);
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
        onError={(error) => handleError(error || 'Unknown error')}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* Loading Indicator */}
      {isLoading && !hasError && (
        <View className='absolute inset-0 justify-center items-center bg-dark-300/90'>
          <ActivityIndicator size="large" color="#AB8BFF" />
          <Text className='text-light-300 mt-2'>Loading video...</Text>
          <Text className='text-light-400 text-xs mt-1 px-4 text-center' numberOfLines={2}>
            {uri.split('/').pop()?.substring(0, 40)}...
          </Text>
        </View>
      )}

      {/* Error State */}
      {hasError && (
        <View className='absolute inset-0 justify-center items-center bg-dark-300 px-5'>
          <Image source={icons.play} className='size-12 mb-2' tintColor='#FF6B6B' />
          <Text className='text-light-100 text-center font-bold'>
            Playback Error
          </Text>
          <Text className='text-light-300 text-sm text-center mt-2'>
            {errorMessage || 'Unable to load video'}
          </Text>
          
          {/* Retry Button */}
          <TouchableOpacity
            onPress={retryLoad}
            className='bg-accent px-6 py-2 rounded-full mt-4'
          >
            <Text className='text-white font-bold'>Retry</Text>
          </TouchableOpacity>

          {/* Open in Browser Button */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Open in Browser',
                'The video plays correctly in a web browser. Copy this URL to watch:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Copy URL', 
                    onPress: () => {
                      // You can use expo-clipboard here
                      console.log('URL:', uri);
                      Alert.alert('URL copied to console');
                    }
                  }
                ]
              );
            }}
            className='mt-2'
          >
            <Text className='text-accent text-sm'>Open in Browser Instead</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};