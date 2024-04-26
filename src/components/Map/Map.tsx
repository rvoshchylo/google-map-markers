import React, { useEffect, useRef, useState } from 'react';
import GoogleMap, { MapRef } from 'react-map-gl'; //MarkerDragEvent, ViewStateChangeEvent
import { Layer, Source } from 'react-map-gl';
import { MarkerInterface } from '../../types/Marker';
import mapboxgl from 'mapbox-gl'; // { LngLat, MapLayerMouseEvent }
import { clusterLayer, clusterCountLayer, unclusteredPointLayer, unclusteredPointTextLayer } from './layers';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import styles from './Map.module.css';
import { generateUniqueID } from '../../utils/generateUniqueID';
import { getMarkers } from '../../utils/getMarkers';
import { updateMarkers } from '../../utils/updateMarkers';

const Map: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerInterface[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [currentMarker, setCurrentMarker] = useState<MarkerInterface | null>(null);
  // const [dragPan, setDragPan] = useState(true);
  // const [dragRotate, setDragRotate] = useState(true);

  const mapRef = useRef<MapRef>(null);

  const date = new Date();

  console.log(date.toString())

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
    const date = new Date();

    const newMarker = { location: {lat, lng }, timestamp: date.toString(), id: generateUniqueID()};

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
        coordinates: [marker.location.lng, marker.location.lat]
      }
    }))
  };

  const handleRightClick = (event: mapboxgl.MapLayerMouseEvent) => {
    event.preventDefault();
    const markersCopy = [...markers];
    const features = mapRef.current?.queryRenderedFeatures(event.point)[0];
    if (!features || !features.properties) {
      return;
    }
    const markerId = features.properties.markerId;
    const index = markersCopy.findIndex(marker => marker.id === markerId);
    markersCopy.splice(index, 1);
    setMarkers(markersCopy);
  };

  // const moveMarker = (event: ViewStateChangeEvent, markerId: number) => {
  //   const markersCopy = [...markers];

  //   const markerIndex = markersCopy.findIndex(marker => marker.id === markerId);

  //   markersCopy[markerIndex] = { id: markerId, lat: event.viewState.latitude, lng: event.viewState.longitude };
  //   setMarkers(markersCopy);

  // };

  // const onDragStart = useCallback((event: ViewStateChangeEvent) => {
  //   logEvents(_events => ({ ..._events, onDragStart: new LngLat(event.viewState.longitude, event.viewState.latitude) }));
  //   const features = mapRef.current?.queryRenderedFeatures(event.point)[0];
  //   if (!features || !features.properties) {
  //     return;
  //   }
  //   setCurrentMarker(markers.find(marker => marker.id === features.properties.markerId) || null);
  //   setDragPan(false);
  //   setDragRotate(false);
  // }, [markers]);

  // const onMarkerDrag = useCallback((event: ViewStateChangeEvent) => {
  //   logEvents(_events => ({ ..._events, onDrag: new LngLat(event.viewState.longitude, event.viewState.latitude) }));
  //   if (!currentMarker) {
  //     return;
  //   }
  //   const markerId = currentMarker.id;
  //   moveMarker(event, markerId);
  // }, [markers]);

  // const onMarkerDragEnd = useCallback((event: ViewStateChangeEvent) => {
  //   logEvents(_events => ({ ..._events, onDragEnd: new LngLat(event.viewState.longitude, event.viewState.latitude) }));
  //   if (!currentMarker) {
  //     return;
  //   }
  //   const markerId = currentMarker.id;
  //   moveMarker(event, markerId);
  //   setCurrentMarker(null);
  //   setDragPan(true);
  //   setDragRotate(true);;
  // }, [markers]);

  return (
    <div className={styles.container}>
      <GoogleMap
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoicnVzZnVzcm8iLCJhIjoiY2x2Z2NucW5yMHZ6bTJsbDk1MWF1d2t3eiJ9.yUhQ0LxrozmR53GVz7UUbw"
        initialViewState={{
          latitude: 49.843644,
          longitude: 24.025614,
          zoom: 8
        }}
        style={{ width: 1000, height: 800 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onClick={(e: mapboxgl.MapLayerMouseEvent) => {
          handleMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng })
        }}
        onContextMenu={(e: mapboxgl.MapLayerMouseEvent) => handleRightClick(e)}
        // onDrag={(e: ViewStateChangeEvent) => onMarkerDrag(e)}
        // onDragStart={(e: ViewStateChangeEvent) => onDragStart(e)}
        // onDragEnd={(e: ViewStateChangeEvent) => onMarkerDragEnd(e)}
      >
        <Source
          id="earthquakes"
          type="geojson"
          data={geojson as FeatureCollection<Geometry, GeoJsonProperties>}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} key={1} />
          <Layer {...clusterCountLayer} key={2} />
          <Layer {...unclusteredPointLayer} key={3} />
          <Layer {...unclusteredPointTextLayer} key={4} />
        </Source>
      </GoogleMap>
    </div>
  );
}

export default Map;