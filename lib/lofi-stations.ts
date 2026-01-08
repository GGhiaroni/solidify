export interface Station {
  id: string;
  name: string;
  streamUrl: string;
  color: string;
}

export const stations: Station[] = [
  {
    id: "lofi-girl",
    name: "Lofi Girl Radio",
    streamUrl: "https://play.streamafrica.net/lofigirl",
    color: "bg-orange-500",
  },
  {
    id: "chillhop",
    name: "Chillhop Raccoon",
    streamUrl: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    color: "bg-blue-500",
  },
  {
    id: "flux-fm",
    name: "FluxFM Focus",
    streamUrl: "https://fluxfm.streamabc.net/flx-focus?sabc=6254",
    color: "bg-green-500",
  },
  {
    id: "smooth-chill",
    name: "Smooth Chill",
    streamUrl: "https://media-ssl.musicradio.com/SmoothChill",
    color: "bg-purple-500",
  },
];
