import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { ArchiveMovie, getFeaturedMovies, searchArchiveMovies } from '../services/internetArchive';
import useFetch from '../services/useFetch';
import SearchBar from './components/SearchBar';

const ArchiveMovieCard = ({ movie }: { movie: ArchiveMovie }) => {
  // Use Internet Archive thumbnail or fallback
  const thumbnailUrl = `https://archive.org/services/img/${movie.identifier}`;

  return (
    <TouchableOpacity className='w-[30%] mb-4'>
      <Image
        source={{ uri: thumbnailUrl }}
        className='w-full h-52 rounded-lg bg-dark-200'
        resizeMode='cover'
      />

      <Text className='text-white text-sm font-bold mt-2' numberOfLines={2}>
        {movie.title}
      </Text>

      {movie.year && (
        <Text className='text-xs text-light-300 font-medium mt-1'>
          {movie.year}
        </Text>
      )}

      <View className='bg-accent px-2 py-1 rounded-full self-start mt-1'>
        <Text className='text-white text-xs font-bold'>FREE</Text>
      </View>
    </TouchableOpacity>
  );
};

const FreeMovies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ArchiveMovie[]>([]);
  const [searching, setSearching] = useState(false);

  const { data: featuredMovies, loading: featuredLoading } = useFetch(getFeaturedMovies);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchArchiveMovies(searchQuery, 30);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const displayMovies = searchQuery.trim() ? searchResults : featuredMovies || [];

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='absolute w-full z-0' />

      <FlatList
        data={displayMovies}
        renderItem={({ item }) => <ArchiveMovieCard movie={item} />}
        keyExtractor={(item) => item.identifier}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 20,
          marginBottom: 10
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20 items-center'>
              <Image source={icons.logot} className='w-12 h-10' />
            </View>

            <Text className='text-white font-bold text-2xl mt-5 mb-3'>
              Free Movies
            </Text>

            <Text className='text-light-300 text-sm mb-5'>
              Public domain & free movies from Internet Archive
            </Text>

            <SearchBar
              placeholder='Search free movies...'
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            {(featuredLoading || searching) && (
              <ActivityIndicator size='large' color='#AB8BFF' className='my-5' />
            )}

            {!featuredLoading && !searching && (
              <Text className='text-lg text-white font-bold mt-5 mb-3'>
                {searchQuery.trim() ? `Results for "${searchQuery}"` : 'Featured Free Movies'}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !featuredLoading && !searching ? (
            <View className='mt-10 px-5'>
              <Text className='text-center text-gray-500'>
                {searchQuery.trim() ? 'No movies found' : 'No movies available'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default FreeMovies;