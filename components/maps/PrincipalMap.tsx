import { useLocationStore } from "@/core/useLocationStore";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";
import AnimatedCarMarker from "./AnimatedCarMarker";
import AsideButtonsActions from "./AsideButtonsActions";
import RouteHistoryModal from "./RouteHistoryModal";
import TrackingOverlay from "./TrackingOverlay";

interface Props extends ViewProps {
  showUserLocation?: boolean;
  initialLocation: LatLng;
}

const PrincipalMap = ({
  initialLocation,
  showUserLocation = true,
  ...rest
}: Props) => {
  const mapRef = useRef<MapView>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [showPolyline, setShowPolyline] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const {
    watchLocation,
    clearWatchLocation,
    laskKnowLocation,
    getLocation,
    userLocationList,
    isTracking,
    isSimulating,
  } = useLocationStore();

  useEffect(() => {
    watchLocation();

    return () => {
      clearWatchLocation();
    };
  }, []);

  useEffect(() => {
    if (laskKnowLocation && isFollowingUser) {
      moveCameraToLocation(laskKnowLocation);
    }
  }, [laskKnowLocation, isFollowingUser]);

  const moveCameraToLocation = (latLng: LatLng) => {
    if (!mapRef.current) return;

    mapRef.current.animateCamera({
      center: latLng,
      zoom: 16,
    });
  };

  const moveToCurrentLocation = async () => {
    if (!laskKnowLocation) {
      moveCameraToLocation(initialLocation);
    } else {
      moveCameraToLocation(laskKnowLocation);
    }

    const location = await getLocation();

    if (!location) return;

    moveCameraToLocation(location);
  };

  const handleShowPopyline = () => {
    setShowPolyline(!showPolyline);
  };

  return (
    <View {...rest}>
      <TrackingOverlay />

      <MapView
        onTouchStart={() => setIsFollowingUser(false)}
        ref={mapRef}
        showsUserLocation={showUserLocation && !isSimulating}
        style={styles.map}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0121,
        }}
      >
        {showPolyline && userLocationList.length > 1 && (
          <Polyline
            coordinates={userLocationList}
            strokeColor={isTracking ? "#3b82f6" : "#6b7280"}
            strokeWidth={6}
            lineDashPattern={isTracking ? undefined : [10, 5]}
          />
        )}

        {isTracking && laskKnowLocation && (
          <Marker
            coordinate={laskKnowLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
            tracksViewChanges
          >
            <AnimatedCarMarker />
          </Marker>
        )}
      </MapView>

      <AsideButtonsActions
        isFollowingUser={isFollowingUser}
        handleShowPopyline={handleShowPopyline}
        moveToCurrentLocation={moveToCurrentLocation}
        setIsFollowingUser={setIsFollowingUser}
        onOpenHistory={() => setIsHistoryVisible(true)}
      />

      <RouteHistoryModal
        isVisible={isHistoryVisible}
        onClose={() => setIsHistoryVisible(false)}
      />
    </View>
  );
};

export default PrincipalMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
