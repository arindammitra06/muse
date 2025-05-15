
export const baseUrl = 'https://jiosaavn.com';
export const homeEndpoint = '/api.php?_format=json&_marker=0&api_version=4&ctx=web6dot0&__call=webapi.getLaunchData';
export const albumDetails = '__call=content.getAlbumDetails';
export const playlistDetails = '__call=playlist.getDetails';
export const fromToken = '__call=webapi.get';
export const  featuredRadio =  '__call=webradio.createFeaturedStation';
export const artistRadio = '__call=webradio.createArtistStation';
export const entityRadio = '__call=webradio.createEntityStation';
export const getResults = '__call=search.getResults';
export const topSearches ='__call=content.getTopSearches';
export const albumResults= '__call=search.getAlbumResults';
export const artistResults= '__call=search.getArtistResults';
export const playlistResults= '__call=search.getPlaylistResults';

import CryptoJS from 'crypto-js';


export const languages = ['Hindi',
    'English',
    'Punjabi',
    'Tamil',
    'Telugu',
    'Marathi',
    'Gujarati',
    'Bengali',
    'Kannada',
    'Bhojpuri',
    'Malayalam',
    'Urdu',
    'Haryanvi',
    'Rajasthani',
    'Odia',
    'Assamese',];
type AnyMap = Record<string, any>;

const key = '38346591'; // Must be exactly 8 bytes for DES

export function getLastSectionOfUrl(url: string): string | undefined {
  const parts = url.split('/');
  const lastPart = parts.pop();
  return lastPart;
}


export function decode(input: string): string {
  const key = CryptoJS.enc.Utf8.parse('38346591');
  const encrypted = CryptoJS.enc.Base64.parse(input);

  // Correct: wrap ciphertext in CipherParams
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: encrypted });

  const decrypted = CryptoJS.DES.decrypt(cipherParams, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  const result = decrypted.toString(CryptoJS.enc.Utf8);

  return result
    .replace(/\.mp4.*/g, '.mp4')
    .replace(/\.m4a.*/g, '.m4a')
    .replace(/\.mp3.*/g, '.mp3')
    .replace(/http:/g, 'https:');
  
}

export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function getPreferredStreamingQualityUrl(url: string, streamingQuality: string): string {
    if(url!==null && url!==undefined){
      const preferredQuality = streamingQuality ?? '96 kbps'
      const newUrl =  url.replaceAll('_96.',  `_${preferredQuality.replaceAll(' kbps', '')}.`);
      return newUrl;
    }else{
      return url;
    }
}

export function countNonPlaylistItems(items: any[]): number {
  return items.filter(item => item.type !== 'playlist').length;
}

export async function formatSongsResponse(
  responseList: any[],
  type: string
): Promise<any[]> {
  const searchedList: any[] = [];

  for (let i = 0; i < responseList.length; i++) {
    let response: Record<string, any> | null = null;

    switch (type) {
      case 'song':
      case 'album':
      case 'playlist':
      case 'show':
      case 'mix':
        response = await formatSingleSongResponse(responseList[i]);
        break;
      default:
        break;
    }

    if (response?.Error) {
      console.error(
        `Error at index ${i} inside formatSongsResponse: ${response.Error}`
      );
    } else if (response) {
      searchedList.push(response);
    }
  }

  return searchedList;
}


export async function formatSingleSongResponse(response: any): Promise<Record<string, any>> {
  try {

    const artistNames: string[] = [];

    const artistMap = response?.more_info?.artistMap;
    const music = response?.more_info?.music;
    if (
      !artistMap?.primary_artists?.length &&
      !artistMap?.featured_artists?.length &&
      !artistMap?.artists?.length
    ) {
      artistNames.push(music ?? 'Unknown');
    } else if (artistMap?.primary_artists?.length) {
      artistMap.primary_artists.forEach((artist: any) => {
        artistNames.push(artist.name);
      });
    } else if (artistMap?.featured_artists?.length) {
      artistMap.featured_artists.forEach((artist: any) => {
        artistNames.push(artist.name);
      });
    } else if (artistMap?.artists?.length) {
      try {
        artistMap.artists[0].id.forEach((artist: any) => {
          artistNames.push(artist.name);
        });
      } catch (err) {
        artistMap.artists.forEach((artist: any) => {
          artistNames.push(artist.name);
        });
      }
    }

    return {
      id: response.id,
      type: response.type,
      album: unescapeHTML(response?.more_info?.album?.toString() ?? ''),
      year: response.year,
      duration: response.more_info?.duration,
      language: response.language?.toString(),
      genre: response.language?.toString(),
      '320kbps': response.more_info?.['320kbps'],
      has_lyrics: response.more_info?.has_lyrics,
      lyrics_snippet: unescapeHTML(response.more_info?.lyrics_snippet?.toString() ?? ''),
      release_date: response.more_info?.release_date,
      album_id: response.more_info?.album_id,
      subtitle: unescapeHTML(response.subtitle?.toString() ?? ''),
      title: unescapeHTML(response.title?.toString() ?? ''),
      artist: unescapeHTML(artistNames.join(', ')),
      artistMap: artistNames,
      album_artist: music,
      image: getImageUrl(response.image?.toString() ?? ''),
      perma_url: response.perma_url,
      url: decode(response.more_info?.encrypted_media_url?.toString() ?? ''),
    };

  } catch (error) {
    console.error('Error inside formatSingleSongResponse:', error);
    return { Error: error };
  }
}

export function formatSingleAlbumSongResponse(response: Record<string, any>): Record<string, any> {
  try {
    const artistNames: string[] = [];

    if (!response['primary_artists'] || response['primary_artists'].toString().trim() === '') {
      if (!response['featured_artists'] || response['featured_artists'].toString().trim() === '') {
        if (!response['singers'] || response['singers'].toString().trim() === '') {
          artistNames.push('Unknown');
        } else {
          response['singers'].toString().split(', ').forEach((element: string) => {
            artistNames.push(element);
          });
        }
      } else {
        response['featured_artists'].toString().split(', ').forEach((element: string) => {
          artistNames.push(element);
        });
      }
    } else {
      response['primary_artists'].toString().split(', ').forEach((element: string) => {
        artistNames.push(element);
      });
    }

    return {
      id: response['id'],
      type: response['type'],
      album: unescape(response['album']?.toString() || ''),
      year: response['year'],
      duration: response['duration'],
      language: response['language']?.toString() ,
      genre: response['language']?.toString() ,
      '320kbps': response['320kbps'],
      has_lyrics: response['has_lyrics'],
      lyrics_snippet: unescape(response['lyrics_snippet']?.toString() || ''),
      release_date: response['release_date'],
      album_id: response['album_id'],
      subtitle: unescape(
        `${response['primary_artists']?.toString().trim() || ''} - ${response['album']?.toString().trim() || ''}`
      ),
      title: unescape(response['song']?.toString() || ''),
      artist: unescape(artistNames.join(', ')),
      album_artist: response['more_info'] == null ? response['music'] : response['more_info']['music'],
      image: getImageUrl(response['image']?.toString() || ''),
      perma_url: response['perma_url'],
      url: decode(response['encrypted_media_url']?.toString() || '')
    };

  } catch (e) {
    console.error('Error inside formatSingleAlbumSongResponse:', e);
    return { Error: e };
  }
}




export async function formatAlbumResponse(responseList: AnyMap[], type: string): Promise<AnyMap[]> {
  const searchedAlbumList: AnyMap[] = [];

  for (let i = 0; i < responseList.length; i++) {
    let response: any | null = null;

    try {
      switch (type) {
        case 'album':
          response = await formatSingleAlbumResponse(responseList[i]);
          break;
        case 'artist':
          response = await formatSingleArtistResponse(responseList[i]);
          break;
        case 'playlist':
          response = await formatSinglePlaylistResponse(responseList[i]);
          break;
        case 'show':
          response = await formatSingleShowResponse(responseList[i]);
          break;
      }

      if (response?.Error) {
        console.log(`Error at index ${i} inside formatAlbumResponse: ${response.Error}`);
      } else {
        searchedAlbumList.push(response);
      }
    } catch (e) {
      console.log(`Unexpected error at index ${i}: ${e}`);
    }
  }

  return searchedAlbumList;
}

// Helpers
async function formatSingleAlbumResponse(response: AnyMap): Promise<AnyMap> {
  try {
    return {
      id: response.id,
      type: response.type,
      album: unescape(response.title?.toString()),
      year: response.more_info?.year ?? response.year,
      language: (response.more_info?.language ?? response.language)?.toString(),
      genre: (response.more_info?.language ?? response.language)?.toString(),
      album_id: response.id,
      subtitle: unescape((response.description ?? response.subtitle)?.toString()),
      title: unescape(response.title?.toString()),
      artist: resolveArtist(response),
      album_artist: response.more_info?.music ?? response.music,
      image: getImageUrl(response.image?.toString()),
      count: response.more_info?.song_pids?.split(', ').length ?? 0,
      songs_pids: response.more_info?.song_pids?.split(', ') ?? [],
      perma_url: response.perma_url?.toString(),
    };
  } catch (e) {
    console.log(`Error inside formatSingleAlbumResponse: ${e}`);
    return { Error: e };
  }
}

async function formatSingleArtistResponse(response: AnyMap): Promise<AnyMap> {
  try {

    return {
      id: response.id,
      title: unescape(response.title!==undefined? response.title?.toString() : response.name?.toString()),
      subtitle: response.subtitle!==undefined? response.subtitle?.toString(): response.type ,
      type: response.type,
      image: getImageUrl(response.image?.toString()),
      description: response.description!==undefined? response.description?.toString(): response.type ,
      perma_url: response.perma_url?.toString(),
    };
  } catch (e) {
    console.log(`Error inside formatSingleArtistResponse: ${e}`);
    return { Error: e };
  }
}

async function formatSinglePlaylistResponse(response: AnyMap): Promise<AnyMap> {
  try {
    return {
      id: response.id,
      title: unescape(response.title?.toString()),
      subtitle: response.subtitle?.toString(),
      type: response.type,
      image: getImageUrl(response.image?.toString()),
      count: response.more_info?.song_count ?? 0,
      perma_url: response.perma_url?.toString(),
    };
  } catch (e) {
    console.log(`Error inside formatSinglePlaylistResponse: ${e}`);
    return { Error: e };
  }
}

async function formatSingleShowResponse(response: AnyMap): Promise<AnyMap> {
  try {
    return {
      id: response.id,
      title: unescape(response.title?.toString()),
      subtitle: response.subtitle?.toString(),
      type: response.type,
      image: getImageUrl(response.image?.toString()),
      description: response.description?.toString(),
      perma_url: response.perma_url?.toString(),
      total_episodes: response.more_info?.episode_count ?? 0,
    };
  } catch (e) {
    console.log(`Error inside formatSingleShowResponse: ${e}`);
    return { Error: e };
  }
}

function resolveArtist(response: AnyMap): string {
  if (response.music) return unescape(response.music.toString());

  const primary = response.more_info?.artistMap?.primary_artists;
  if (Array.isArray(primary) && primary.length > 0) {
    return unescape(primary[0]?.name ?? '');
  }

  const music = response.more_info?.music;
  return music ? unescape(music.toString()) : '';
}

export async function formatArtistTopAlbumsResponse(
  responseList: any[],
): Promise<any[]> {
  const result: any[] = [];

  for (let i = 0; i < responseList.length; i++) {
    const response = await formatSingleArtistTopAlbumSongResponse(responseList[i]);

    if ('Error' in response) {
      console.error(
        `Error at index ${i} inside formatArtistTopAlbumsResponse: ${response.Error}`,
      );
    } else {
      result.push(response);
    }
  }

  return result;
}

export async function formatSingleArtistTopAlbumSongResponse(
  response: any,
): Promise<any> {
  try {
    const artistNames: string[] = [];

    const artistMap = response.more_info?.artistMap;

    if (!artistMap?.primary_artists?.length) {
      if (!artistMap?.featured_artists?.length) {
        if (!artistMap?.artists?.length) {
          artistNames.push('Unknown');
        } else {
          artistMap.artists.forEach((el: { name: string; }) => artistNames.push(el.name));
        }
      } else {
        artistMap.featured_artists.forEach((el: { name: string; }) => artistNames.push(el.name));
      }
    } else {
      artistMap.primary_artists.forEach((el: { name: string; }) => artistNames.push(el.name));
    }

    return {
      id: response.id,
      type: response.type,
      album: unescape(response.title),
      year: response.year,
      language: response.language,
      genre: response.language,
      album_id: response.id,
      subtitle: unescape(response.subtitle),
      title: unescape(response.title),
      artist: unescape(artistNames.join(', ')),
      album_artist: response.more_info?.music ?? response.music ?? '',
      image: getImageUrl(response.image),
    };
  } catch (e) {
    console.error(`Error inside formatSingleArtistTopAlbumSongResponse: ${e}`);
    return { Error: e };
  }
}


export async function formatSimilarArtistsResponse(
  responseList: any[],
): Promise<(any | { Error: unknown })[]> {
  const result: (any | { Error: unknown })[] = [];

  for (let i = 0; i < responseList.length; i++) {
    const response = await formatSingleSimilarArtistResponse(responseList[i]);

    if ('Error' in response) {
      console.error(`Error at index ${i} inside formatSimilarArtistsResponse: ${response.Error}`);
    } else {
      result.push(response);
    }
  }

  return result;
}

export async function formatSingleSimilarArtistResponse(
  response: any,
): Promise<any | { Error: unknown }> {
  try {
    return {
      id: response.id,
      type: response.type,
      artist: unescape(response.name),
      title: unescape(response.name),
      subtitle: response.dominantType,
      image: getImageUrl(response.image_url),
      artistToken: response.perma_url.split('/').pop() ?? '',
      perma_url: response.perma_url,
    };
  } catch (e) {
    console.error(`Error inside formatSingleSimilarArtistResponse: ${e}`);
    return { Error: e };
  }
}

export function getSubTitle(item: any): string {
  const type = item.type;

  const getSubtitleOrDefault = () =>
    !item.subtitle?.trim()
      ? 'JioSaavn'
      : unescapeHTML(item.subtitle);

  switch (type) {
    case 'charts':
      return '';

    case 'radio_station':
      return `Radio • ${getSubtitleOrDefault()}`;

    case 'playlist':
      return `Playlist • ${getSubtitleOrDefault()}`;

    case 'song':{
      const artists = item.more_info?.artistMap?.artists?.map((a: { name: any; }) => a.name);
      
      if (artists?.length) {
        return `Single • ${unescapeHTML(artists.join(', '))}`;
      
      } else if (item.subtitle?.trim()) {
        
        return `Single • ${item.subtitle}`;
      }
    }
    case 'mix':
      return `Mix • ${getSubtitleOrDefault()}`;

    case 'show':
      return `Podcast • ${getSubtitleOrDefault()}`;

    case 'album': {
      const artists = item.more_info?.artistMap?.artists?.map((a: { name: any; }) => a.name);
      if (artists?.length) {
        return `Album • ${unescapeHTML(artists.join(', '))}`;
      } else if (item.subtitle?.trim()) {
        return `Album • ${unescapeHTML(item.subtitle)}`;
      }
      return 'Album';
    }

    default: {
      const artists = item.more_info?.artistMap?.artists?.map((a: { name: any; }) => a.name);
      return artists?.length ? unescapeHTML(artists.join(', ')) : '';
    }
  }
}

export function unescapeHTML(str: string): string {
  return str.replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getImageUrl(imageUrl?: string, quality: 'high' | 'medium' | 'low' = 'high'): string {
  if (!imageUrl) return '';

  const trimmedUrl = imageUrl.trim().replace('http:', 'https:');

  switch (quality) {
    case 'high':
      return trimmedUrl.replace(/50x50|150x150/g, '500x500');
    case 'medium':
      return trimmedUrl
        .replace(/50x50|500x500/g, '150x150');
    case 'low':
      return trimmedUrl
        .replace(/150x150|500x500/g, '50x50');
    default:
      return trimmedUrl.replace(/50x50|150x150/g, '500x500');
  }
}

