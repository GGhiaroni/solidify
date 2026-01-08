export interface Station {
  id: string;
  name: string;
  videoId: string;
  color: string;
}

export const stations: Station[] = [
  {
    id: "lofi-girl",
    name: "Lofi Girl",
    videoId: "jfKfPfyJRdk",
    color: "bg-orange-500",
  },
  {
    id: "synthwave",
    name: "Synthwave",
    videoId: "4xDzrJKXOOY",
    color: "bg-purple-500",
  },
  {
    id: "jazz",
    name: "Coffee Jazz",
    videoId: "Dx5qFacdQV4",
    color: "bg-yellow-600",
  },
  {
    id: "rain",
    name: "Rain Sounds",
    videoId: "mPZkdNFkNps",
    color: "bg-blue-500",
  },
];
