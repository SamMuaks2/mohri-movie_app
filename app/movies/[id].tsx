// import { icons } from '@/constants/icons';
// import { router, useLocalSearchParams } from 'expo-router';
// import React, { useCallback, useState } from 'react';
// import { ActivityIndicator, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import YoutubePlayer from 'react-native-youtube-iframe';
// import * as WebBrowser from 'expo-web-browser';
// import { fetchMovieDetails, fetchMovieVideos } from '../services/api';
// import useFetch from '../services/useFetch';

// interface MovieInfoProps {
//   label: string;
//   value?: string | number | null;
// }

// const MovieInfo = ({label, value}: MovieInfoProps) => (
//   <View className='flex-col items-start justify-center mt-5'>
//     <Text className='text-light-200 font-normal text-sm'>
//       {label}
//     </Text>
    
//     <Text className='text-light-100 font-bold text-sm mt-2'>
//       {value || 'N/A'}
//     </Text>
//   </View>
// )

// const MovieDetails = () => {
//   const {id} = useLocalSearchParams();

//   const {data: movie, loading: movieLoading} = useFetch(() => 
//     fetchMovieDetails(id as string)
// );

//   const { data: videos, loading: videosLoading } = useFetch(() =>
//     fetchMovieVideos(id as string)
//   );

//   // ── trailer modal state ──
//   const [modalVisible, setModalVisible] = useState(false);
//   const [playing, setPlaying] = useState(false);

//   // pick the best trailer key (first in the sorted list returned by the API)
//   const trailerKey = videos?.[0]?.key ?? null;
//   const hasTrailer = !!trailerKey;

//   const onChangeState = useCallback((event: string) => {
//     if (event === 'ended') {
//       setPlaying(false);
//     }
//   }, []);

//   const openTrailer = () => {
//     if (!hasTrailer) return;
//     setPlaying(true);
//     setModalVisible(true);
//   };

//   const closeTrailer = () => {
//     setPlaying(false);
//     setModalVisible(false);
//   };

//   const isLoading = movieLoading || videosLoading;

//   // ── loading state ──
//   if (isLoading) {
//     return (
//       <View className="flex-1 bg-primary justify-center items-center">
//         <ActivityIndicator size="large" color="#AB8BFF" />
//       </View>
//     );
//   }
  

//   return (
//     <View className='bg-primary flex-1'>
//       <ScrollView contentContainerStyle={{paddingBottom: 80}}>
//         <View>
//           <Image
//             source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
//             className='w-full h-[550px]'
//             resizeMode='stretch'
//           />

//           {/* Play button — only shown when a trailer is available */}
//           {hasTrailer && (
//             <TouchableOpacity
//               onPress={openTrailer}
//               className="absolute inset-0 justify-center items-center"
//               activeOpacity={0.7}
//             >
//               {/* semi-transparent dark circle */}
//               <View className="w-20 h-20 rounded-full bg-black/60 justify-center items-center border-2 border-white/80">
//                 <Image
//                   source={icons.play}
//                   className="size-8 ml-1"
//                   tintColor="#fff"
//                 />
//               </View>
//             </TouchableOpacity>
//           )}
//         </View>

//         <View className='flex-col items-start justify-center mt-5 px-5'>
//           <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
//           <View className='flex-row items-center gap-x-1 mt-2'>
//             <Text className='text-light-200 text-sm'>
//               {movie?.release_date?.split('-')[0]}
//             </Text>
            
//             <Text className='text-light-200 text-sm'>
//               {movie?.runtime}m
//             </Text>
//           </View>

//           <View className='flex-row items-center bg-dark-100px-2 py-1 rounded-md gap-x-1 mt-2'>
//             <Image
//               source={icons.star}
//               className='size-4'
//             />

//             <Text className='text-white font-bold text-sm'>
//               {Math.round(movie?.vote_average ?? 0)}/10
//             </Text>

//             <Text className='text-light-200 text-sm'>
//               ({movie?.vote_count} votes)
//             </Text>
//           </View>

//           <MovieInfo 
//             label='Overview'
//             value={movie?.overview}
//           />

//           <MovieInfo 
//             label='Genres'
//             value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'}
//           />

//           <View className='flex flex-row justify-between w-1/2'>
//             <MovieInfo
//               label='Budget'
//               value={`$${movie?.budget / 1_000_000} million`}
//             />
            
//             <MovieInfo
//               label='Revenue'
//               value={`$${Math.round(movie?.revenue) / 1_000_000}`}
//             />
//           </View>

//           <MovieInfo
//               label='Production Companies'
//               value={movie?.production_companies.map((c) => c.name).join(' - ') || 'N/A'}
//             />

//              {/* trailer label when available */}
//           {hasTrailer && (
//             <TouchableOpacity
//               onPress={openTrailer}
//               className="mt-6 flex-row items-center gap-x-2"
//               activeOpacity={0.7}
//             >
//               <View className="bg-accent rounded-full px-4 py-2 flex-row items-center gap-x-2">
//                 <Image
//                   source={icons.play}
//                   className="size-4"
//                   tintColor="#fff"
//                 />
//                 <Text className="text-white font-semibold text-sm">
//                   Watch Trailer
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>

//       <TouchableOpacity 
//         className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
//         onPress={router.back}
//       >
//         <Image
//           source={icons.arrow}
//           className='size-5 mr-1 mt-0.5 rotate-180'
//           tintColor='#fff'
//         />

//         <Text className='text-white font-semibold text-base'>Go back</Text>
//       </TouchableOpacity>

//        {/* ── Trailer Modal ── */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={closeTrailer}
//       >
//         <TouchableOpacity
//           className="flex-1 bg-black/90 justify-center items-center px-5"
//           onPress={closeTrailer}
//           activeOpacity={1}
//         >
//           {/* Close button */}
//           <TouchableOpacity
//             className="self-end mb-3 p-2"
//             onPress={closeTrailer}
//           >
//             <Text className="text-white text-2xl font-bold">✕</Text>
//           </TouchableOpacity>

//           {/* YouTube player */}
//           {modalVisible && trailerKey && (
//             <YoutubePlayer
//               height={220}
//               videoId={trailerKey}
//               play={playing}
//               onChangeState={onChangeState}
//               onError={() => closeTrailer()}
//               initialPlayerParams={{
//                 showClosedCaptions: false,
//                 cc_lang_pref: 'en',
//               }}
//             />
//           )}

//           {/* Video title */}
//           <Text className="text-light-200 text-sm mt-3 text-center">
//             {videos?.[0]?.name || 'Trailer'}
//           </Text>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   )
// }

// export default MovieDetails



import { icons } from '@/constants/icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { HybridVideoPlayer } from '../components/HybridVideoPlayer';
import { fetchMovieDetails } from '../services/api';
import { findArchiveMatch, getArchiveMovieDetails, getStreamingOptions, getStreamingUrl } from '../services/internetArchive';
import useFetch from '../services/useFetch';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({label, value}: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-200 font-normal text-sm'>
      {label}
    </Text>
    
    <Text className='text-light-100 font-bold text-sm mt-2'>
      {value || 'N/A'}
    </Text>
  </View>
);

const MovieDetails = () => {
  const {id} = useLocalSearchParams();
  const [streamingUrl, setStreamingUrl] = useState<string | null>(null);
  const [streamingOptions, setStreamingOptions] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [loadingStream, setLoadingStream] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const {data: movie, loading: movieLoading} = useFetch(() => fetchMovieDetails(id as string));

  // Try to find movie on Internet Archive
  useEffect(() => {
    const findStreamingSource = async () => {
      if (!movie) return;

      setLoadingStream(true);
      try {
        // Search Internet Archive for this movie
        const releaseYear = movie.release_date?.split('-')[0];
        const archiveMatch = await findArchiveMatch(movie.title, releaseYear);

        if (archiveMatch) {
          // Get streaming details
          const archiveDetails = await getArchiveMovieDetails(archiveMatch.identifier);
          const url = getStreamingUrl(archiveDetails);
          const options = getStreamingOptions(archiveDetails);

          setStreamingUrl(url);
          setStreamingOptions(options);

          if (options.length > 0) {
            setSelectedQuality(options[0].url);
          }
        }
      } catch (error) {
        console.error('Error finding streaming source:', error);
      } finally {
        setLoadingStream(false);
      }
    };

    findStreamingSource();
  }, [movie]);

  const handleWatchMovie = () => {
    if (!streamingUrl && !selectedQuality) {
      Alert.alert(
        'Not Available',
        'This movie is not available for free streaming on Internet Archive. It may be available on paid streaming services.',
        [{ text: 'OK' }]
      );
      return;
    }

    setShowPlayer(true);
  };

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        {/* Movie Poster */}
        <View>
          <Image
            source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
            className='w-full h-[550px]'
            resizeMode='stretch'
          />
        </View>

        {/* Streaming Section */}
        <View className='px-5 mt-5'>
          {loadingStream ? (
            <View className='py-5'>
              <ActivityIndicator size="large" color="#AB8BFF" />
              <Text className='text-light-300 text-center mt-2'>
                Searching for free stream...
              </Text>
            </View>
          ) : streamingUrl || selectedQuality ? (
            <>
              <Text className='text-white font-bold text-lg mb-3'>
                Watch Free on Internet Archive
              </Text>

              {!showPlayer ? (
                <TouchableOpacity
                  onPress={handleWatchMovie}
                  className='w-full h-52 bg-dark-200 rounded-lg overflow-hidden justify-center items-center'
                >
                  <Image source={icons.play} className='size-16 mb-2' tintColor='#AB8BFF' />
                  <Text className='text-white font-bold text-lg'>Play Movie</Text>
                  <Text className='text-light-300 text-sm mt-1'>
                    Free & Legal via Internet Archive
                  </Text>
                </TouchableOpacity>
              ) : (
                <HybridVideoPlayer uri={selectedQuality || streamingUrl || ''}/>
              )}

              {/* Quality Options */}
              {streamingOptions.length > 1 && (
                <View className='mt-3'>
                  <Text className='text-light-200 text-sm mb-2'>Quality:</Text>
                  <View className='flex-row flex-wrap gap-2'>
                    {streamingOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedQuality(option.url);
                          setShowPlayer(true);
                        }}
                        className={`px-4 py-2 rounded-full ${
                          selectedQuality === option.url
                            ? 'bg-accent'
                            : 'bg-dark-200'
                        }`}
                      >
                        <Text className='text-white text-xs font-bold'>
                          {option.quality}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <View className='mt-2 bg-dark-200 p-3 rounded-lg'>
                <Text className='text-light-300 text-xs'>
                  ℹ️ This movie is available in the public domain via Internet Archive.
                  All content is legal and free to stream.
                </Text>
              </View>
            </>
          ) : (
            <View className='py-5 bg-dark-200 rounded-lg px-4'>
              <Text className='text-light-100 text-center font-bold'>
                Not Available for Free Streaming
              </Text>
              <Text className='text-light-300 text-center text-sm mt-2'>
                This movie is not available on Internet Archive.
                Check paid streaming services.
              </Text>
            </View>
          )}
        </View>

        {/* Movie Info */}
        <View className='flex-col items-start justify-center mt-5 px-5'>
          <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
          <View className='flex-row items-center gap-x-1 mt-2'>
            <Text className='text-light-200 text-sm'>
              {movie?.release_date?.split('-')[0]}
            </Text>
            
            <Text className='text-light-200 text-sm'>
              {movie?.runtime}m
            </Text>
          </View>

          <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
            <Image
              source={icons.star}
              className='size-4'
            />

            <Text className='text-white font-bold text-sm'>
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className='text-light-200 text-sm'>
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo 
            label='Overview'
            value={movie?.overview}
          />

          <MovieInfo 
            label='Genres'
            value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'}
          />

          <View className='flex flex-row justify-between w-1/2'>
            <MovieInfo
              label='Budget'
              value={movie?.budget ? `$${movie.budget / 1_000_000}M` : 'N/A'}
            />
            
            <MovieInfo
              label='Revenue'
              value={movie?.revenue ? `$${Math.round(movie.revenue / 1_000_000)}M` : 'N/A'}
            />
          </View>

          <MovieInfo
            label='Production Companies'
            value={movie?.production_companies?.map((c) => c.name).join(' - ') || 'N/A'}
          />
        </View>
      </ScrollView>

      <TouchableOpacity 
        className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className='size-5 mr-1 mt-0.5 rotate-180'
          tintColor='#fff'
        />

        <Text className='text-white font-semibold text-base'>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;