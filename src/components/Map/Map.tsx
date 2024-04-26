import React, { useEffect, useState } from 'react';
import GoogleMap from 'react-map-gl';
import { Layer, Source } from 'react-map-gl';
import { MarkerInterface } from '../../types/Marker';
import mapboxgl from 'mapbox-gl';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, unclusteredPointTextLayer } from './layers';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import styles from './Map.module.css';
import { generateUniqueID } from '../../utils/generateUniqueID';
import { getMarkers } from '../../utils/getMarkers';
import { updateMarkers } from '../../utils/updateMarkers';

const Map: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerInterface[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); 
  // const [, logEvents] = useState<Record<string, LngLat>>({});
  console.log(markers);

  useEffect(() => {
    getMarkers()
      .then((markers) => {
        setIsLoaded(true);
        setMarkers(markers)
      });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return
    };
    updateMarkers(markers);
  }, [markers]);

  const handleMapClick = ({ lat, lng }: { lat: number, lng: number }) => {
    const newMarker = { id: generateUniqueID(), lat, lng };

    if (markers.length > 0) {
      const lastMarker = markers[markers.length - 1];
      lastMarker.next = newMarker;
    }
    setMarkers([...markers, newMarker]);
  };

  const geojson = {
    type: 'FeatureCollection',
    features: markers.map((marker, index) => ({
      type: 'Feature',
      properties: { markerId: marker.id, index: index + 1 },
      geometry: {
        type: 'Point',
        coordinates: [marker.lng, marker.lat]
      }
    }))
  };

  // const handleRightClick = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   const markersCopy = [...markers];
  //   const index = Number(event.currentTarget.textContent) - 1;
  //   markersCopy.splice(index, 1);
  //   setMarkers(markersCopy);
  // };

  // const moveMarker = (event: MarkerDragEvent, markerId: number) => {
  //   const markersCopy = [...markers];
  //   const markerIndex = markersCopy.findIndex(marker => marker.id === markerId);

  //   markersCopy[markerIndex] = { id: markerId, lat: event.lngLat.lat, lng: event.lngLat.lng };
  //   setMarkers(markersCopy);
  // };

  // const onMarkerDrag = useCallback((event: MarkerDragEvent, markerId: number) => {
  //   logEvents(_events => ({ ..._events, onDrag: new LngLat(event.lngLat.lng, event.lngLat.lat) }));
  //   moveMarker(event, markerId);
  // }, [markers]);

  // const onMarkerDragEnd = useCallback((event: MarkerDragEvent, markerId: number) => {
  //   logEvents(_events => ({ ..._events, onDragEnd: new LngLat(event.lngLat.lng, event.lngLat.lat) }));
  //   moveMarker(event, markerId);
  // }, [markers]);

  return (
    <div className={styles.container}>
      <GoogleMap
        mapboxAccessToken="pk.eyJ1IjoicnVzZnVzcm8iLCJhIjoiY2x2Z2NucW5yMHZ6bTJsbDk1MWF1d2t3eiJ9.yUhQ0LxrozmR53GVz7UUbw"
        initialViewState={{
          latitude: 49.843644,
          longitude: 24.025614,
          zoom: 8
        }}
        style={{ width: 1000, height: 800 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={(e: mapboxgl.MapLayerMouseEvent) => handleMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng })}

      >
        <Source
          id="earthquakes"
          type="geojson"
          data={geojson as FeatureCollection<Geometry, GeoJsonProperties>}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
          <Layer {...unclusteredPointTextLayer} />
        </Source>
      </GoogleMap>
    </div>
  );
}

export default Map;