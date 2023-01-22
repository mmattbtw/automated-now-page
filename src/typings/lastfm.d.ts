export interface RecentTrack {
  recenttracks: Recenttracks;
}
interface Recenttracks {
  track: TrackItem[];
  "@attr": {
    user: string;
    totalPages: string;
    page: string;
    total: string;
    perPage: string;
  };
}
export interface TrackItem {
  artist: Artist;
  streamable: string;
  image: ImageItem[];
  mbid: string;
  album: Album;
  name: string;
  "@attr": {
    nowplaying?: string;
  };
  url: string;
  date: Date;
}
interface Artist {
  mbid: string;
  "#text": string;
}
interface ImageItem {
  size: string;
  "#text": string;
}
interface Album {
  mbid: string;
  "#text": string;
}
interface Date {
  uts: string;
  "#text": string;
}
