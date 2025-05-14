import axios from "axios";
import stringSimilarity from 'string-similarity';

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';



export class Lyrics {



  static async getLyrics({
    id,
    title,
    artist,
    saavnHas,
  }: {
    id: string;
    title: string;
    artist: string;
    saavnHas: boolean;
  }): Promise<{ lyrics: string[]; type: string; source: string; id: string }> {

    const result = {
      lyrics: [],
      type: 'text',
      source: '',
      id,
    };

    console.info('Getting Lyrics');
    const res = await this.getSpotifyLyrics(title, artist);
    Object.assign(result, res);

    return result;
  }


  static getSpotifyAccessToken = async () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`), // Use Buffer in Node.js instead
    };

    try {
      const response = await axios.post(tokenUrl, body, { headers });
      return response.data.access_token;
    } catch (error: any) {
      console.error('Error fetching Spotify token:', error.response?.data || error.message);
      return null;
    }
  };




  static searchSpotifyTrack = async (
    title: string,
    artist: string,
    accessToken: string
  ) => {
    try {
      const query = `track:${title} artist:${artist}`;
      const response = await axios.get(SPOTIFY_API_BASE_URL + '/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: query,
          type: 'track',
          limit: 10,
        },
      });

      const items = response.data.tracks.items;

      const normalizedQuery = `${title.toLowerCase()} ${artist.toLowerCase()}`;

      const scored = items.map((track: any) => {
        const trackText = `${track.name} ${track.artists.map((a: any) => a.name).join(' ')}`.toLowerCase();
        const score = stringSimilarity.compareTwoStrings(normalizedQuery, trackText);
        return { track, score };
      });

      scored.sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
      return {
        bestMatch: scored[0]?.track,
        allMatches: items,
      };
    } catch (error: any) {
      console.error('Spotify Search Error:', error.message);
      return {
        bestMatch: null,
        allMatches: [],
        error: error.message,
      };
    }
  }

  static async getSpotifyLyrics(title: string, artist: string): Promise<{ lyrics: string; type: string; source: string }> {

    const result = {
      lyrics: '',
      type: 'text',
      source: 'Spotify',
    };

    try {
      const titleCleaned = Lyrics.cleanString(title);
      const artistCleaned = Lyrics.cleanString(artist);
      let accessToken = await Lyrics.getSpotifyAccessToken();

      const data = await Lyrics.searchSpotifyTrack(titleCleaned, artistCleaned, accessToken);
      console.log(data)
      
      let trackId;
      
      if(data!==undefined && data!==null && data.bestMatch!==undefined && data.bestMatch!==null){
        trackId = data.bestMatch.id;
      }else{
        trackId = data.allMatches[0].id;
      }
      // Step 2: Get lyrics from unofficial Spotify lyrics API
      const lyricsResponse = await axios.get(
        'https://spotify-lyrics-api-flame.vercel.app/',
        {
          params: {
            trackid: trackId,
          },
        }
      );

      const lyricsData = lyricsResponse.data;
      if (lyricsData !== null && lyricsData !== undefined && (lyricsData.syncType === "UNSYNCED" || lyricsData.syncType === "LINE_SYNCED")) {
        result.lyrics = lyricsData.lines;
        result.type = lyricsData.syncType;
      }
    } catch (e) {
      console.error('Error in getSpotifyLyrics', e);
      return result
    }

    return result;
  }


  static cleanString(rawTitle: string) {
    return rawTitle.toLowerCase()
      .replace(/\(.*?\)/g, '')                // Remove parentheses
      .replace(/\[.*?\]/g, '')                // Remove brackets
      .replace(/[^a-zA-Z0-9\s]/g, '')         // Remove symbols
      .replace(/\s{2,}/g, ' ')                // Remove double spaces
      .replace(/\(.*?(remix|instrumental|version|edit).*?\)/gi, '')
      .replace(/- .*?(remix|edit|live|karaoke)/gi, '')
      .trim()
  }


}
