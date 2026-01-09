export interface Station {
  id: string;
  name: string;
  streamUrl: string;
  color: string;
}

export const stations: Station[] = [
  {
    id: "chillhop",
    name: "Chillhop Raccoon",
    streamUrl: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    color: "bg-blue-500",
  },
  {
    id: "smooth-chill",
    name: "Smooth Chill",
    streamUrl: "https://media-ssl.musicradio.com/SmoothChill",
    color: "bg-purple-500",
  },
];
