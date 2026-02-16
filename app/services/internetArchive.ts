// Legal full movie streaming via Internet Archive

export interface ArchiveMovie {
  identifier: string;
  title: string;
  description?: string;
  year?: string;
  creator?: string;
  mediatype: string;
  downloads?: number;
  item_size?: number;
}

export interface ArchiveFile {
  name: string;
  source: string;
  format: string;
  size: string;
  md5?: string;
  mtime?: string;
  title?: string;
}

export interface ArchiveMetadata {
  identifier: string;
  metadata: {
    title: string;
    description?: string;
    date?: string;
    creator?: string;
    subject?: string[];
    runtime?: string;
  };
  files: ArchiveFile[];
  server: string;
  dir: string;
}

const ARCHIVE_API_BASE = 'https://archive.org';

/**
 * Search Internet Archive for movies
 * @param query - Search term
 * @param limit - Number of results (default 50)
 */
export const searchArchiveMovies = async (
  query: string,
  limit: number = 50
): Promise<ArchiveMovie[]> => {
  try {
    // Search for movies in the "movies" collection
    const searchQuery = query 
      ? `${query} AND mediatype:movies`
      : 'mediatype:movies';
    
    const url = `${ARCHIVE_API_BASE}/advancedsearch.php?q=${encodeURIComponent(searchQuery)}&fl[]=identifier,title,description,year,creator,mediatype,downloads,item_size&sort[]=downloads+desc&rows=${limit}&page=1&output=json`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to search Internet Archive');
    }

    const data = await response.json();
    return data.response.docs as ArchiveMovie[];
  } catch (error) {
    console.error('Error searching Internet Archive:', error);
    throw error;
  }
};

/**
 * Get metadata and streaming files for a specific movie
 * @param identifier - Internet Archive item identifier
 */
export const getArchiveMovieDetails = async (
  identifier: string
): Promise<ArchiveMetadata> => {
  try {
    const url = `${ARCHIVE_API_BASE}/metadata/${identifier}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details from Internet Archive');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Archive movie details:', error);
    throw error;
  }
};

/**
 * Get the best streaming URL for a movie
 * Prioritizes MP4 > OGV > other video formats
 */
export const getStreamingUrl = (metadata: ArchiveMetadata): string | null => {
  const { files, server, dir } = metadata;
  
  if (!files || files.length === 0) return null;

  // Find video files and prioritize by format
  const videoFormats = ['MPEG4', 'h.264', 'MP4', 'OGG Video', 'MPEG2'];
  
  for (const format of videoFormats) {
    const videoFile = files.find(
      file => file.format === format && !file.name.includes('.thumbs')
    );
    
    if (videoFile) {
      return `${server}${dir}/${videoFile.name}`;
    }
  }

  // Fallback: find any video file
  const anyVideo = files.find(
    file => 
      file.name.toLowerCase().endsWith('.mp4') ||
      file.name.toLowerCase().endsWith('.ogv') ||
      file.name.toLowerCase().endsWith('.mpeg')
  );

  if (anyVideo) {
    return `${server}${dir}/${anyVideo.name}`;
  }

  return null;
};

/**
 * Get all available quality options for a movie
 */
export const getStreamingOptions = (metadata: ArchiveMetadata) => {
  const { files, server, dir } = metadata;
  
  const videoFiles = files.filter(
    file => 
      (file.format?.includes('MPEG') || 
       file.format?.includes('MP4') || 
       file.format?.includes('OGG') ||
       file.name.toLowerCase().endsWith('.mp4') ||
       file.name.toLowerCase().endsWith('.ogv')) &&
      !file.name.includes('.thumbs')
  );

  return videoFiles.map(file => ({
    url: `${server}${dir}/${file.name}`,
    format: file.format,
    size: file.size,
    name: file.name,
    quality: determineQuality(file.name, file.format)
  }));
};

/**
 * Determine video quality from filename/format
 */
const determineQuality = (filename: string, format: string): string => {
  const name = filename.toLowerCase();
  
  if (name.includes('1080') || name.includes('hd')) return '1080p';
  if (name.includes('720')) return '720p';
  if (name.includes('480')) return '480p';
  if (format?.includes('MPEG4') || format?.includes('h.264')) return 'High';
  if (format?.includes('OGG')) return 'Medium';
  
  return 'Standard';
};

/**
 * Get popular/featured movies from Internet Archive
 * These are curated collections of classic films
 */
export const getFeaturedMovies = async (): Promise<ArchiveMovie[]> => {
  try {
    // Get movies from popular collections
    const collections = [
      'prelinger', // Prelinger Archives - educational/industrial films
      'moviesandfilms', // General movies
      'feature_films', // Feature films
      'silentfilms', // Silent films
    ];

    const query = collections.map(c => `collection:${c}`).join(' OR ');
    
    const url = `${ARCHIVE_API_BASE}/advancedsearch.php?q=(${encodeURIComponent(query)}) AND mediatype:movies&fl[]=identifier,title,description,year,creator,downloads&sort[]=downloads+desc&rows=20&page=1&output=json`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured movies');
    }

    const data = await response.json();
    return data.response.docs;
  } catch (error) {
    console.error('Error fetching featured movies:', error);
    throw error;
  }
};

/**
 * Match TMDB movie with Internet Archive
 * Searches by title and year
 */
export const findArchiveMatch = async (
  tmdbTitle: string,
  tmdbYear?: string
): Promise<ArchiveMovie | null> => {
  try {
    // Clean up title for better matching
    const cleanTitle = tmdbTitle
      .replace(/[^\w\s]/gi, '') // Remove special characters
      .trim();

    const searchQuery = tmdbYear 
      ? `${cleanTitle} ${tmdbYear}`
      : cleanTitle;

    const results = await searchArchiveMovies(searchQuery, 10);
    
    if (results.length === 0) return null;

    // Try to find best match
    const exactMatch = results.find(
      movie => 
        movie.title?.toLowerCase().includes(cleanTitle.toLowerCase()) &&
        (!tmdbYear || movie.year === tmdbYear)
    );

    return exactMatch || results[0];
  } catch (error) {
    console.error('Error finding Archive match:', error);
    return null;
  }
};