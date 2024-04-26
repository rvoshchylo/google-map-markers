export interface MarkerInterface {
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  id: number;
  next?: MarkerInterface;
}
