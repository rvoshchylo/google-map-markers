export interface MarkerInterface {
  location: {
    lat: number;
    lng: number;
  };
  timestamp: number;
  id: number;
  next?: MarkerInterface;
}
