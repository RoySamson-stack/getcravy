import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme, Appbar } from 'react-native-paper';
import AppHeader from '../components/AppHeader';

const MapScreen: React.FC = ({ navigation }) => {
  const { colors } = useTheme();
  
  // Sample locations data
  const locations = [
    {
      id: '1',
      name: 'Sunset Restaurant',
      latitude: 37.78825,
      longitude: -122.4324,
      type: 'restaurant',
    },
    // More locations...
  ];

  return (
    <View style={styles.container}>
      <AppHeader 
        title="Find Nearby" 
        onBackPress={() => navigation.goBack()}
      />
      
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {locations.map(location => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            pinColor={location.type === 'restaurant' ? colors.primary : colors.secondary}
            onCalloutPress={() => navigation.navigate('VenueDetail', { venueId: location.id })}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;