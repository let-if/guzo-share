// import React from 'react';
// import { StyleSheet, View, Platform, Text } from 'react-native';

// interface LiveMapProps {
//   latitude: number;
//   longitude: number;
//   title: string;
// }

// export default function LiveMap({ latitude, longitude, title }: LiveMapProps) {
//   if (Platform.OS === 'web') {
//     const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`;

//     return (
//       <View style={styles.mapContainer}>
//         <iframe
//           width="100%"
//           height="100%"
//           src={mapEmbedUrl}
//           style={{ border: 0, borderRadius: 12 }}
//           title={title}
//         />
//         <View style={styles.mapOverlayBadge}>
//           <Text style={styles.mapBadgeText}>📍 {title}</Text>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.mapContainer}>
//       <Text style={{ textAlign: 'center', marginTop: 60, color: '#64748B', fontWeight: '800', fontSize: 12 }}>
//         📍 Active Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mapContainer: {
//     width: '100%',
//     height: 160,
//     borderRadius: 14,
//     overflow: 'hidden',
//     backgroundColor: '#F1F5F9',
//     marginVertical: 8,
//     borderWidth: 1,
//     borderColor: '#CBD5E1',
//     position: 'relative'
//   },
//   mapOverlayBadge: {
//     position: 'absolute',
//     bottom: 8,
//     left: 8,
//     backgroundColor: 'rgba(15, 23, 42, 0.9)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6
//   },
//   mapBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 10,
//     fontWeight: '900'
//   }
// });
import React from 'react';
import { StyleSheet, View, Platform, Text } from 'react-native';

interface LiveMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export default function LiveMap({ latitude, longitude, title }: LiveMapProps) {
  if (!latitude || !longitude) {
    return (
      <View style={styles.mapContainer}>
        <Text style={styles.fallbackText}>📍 Location coordinates unavailable</Text>
      </View>
    );
  }

  // Web (Vercel) view using OpenStreetMap iframe
  if (Platform.OS === 'web') {
    const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`;

    return (
      <View style={styles.mapContainer}>
        <iframe
          width="100%"
          height="100%"
          src={mapEmbedUrl}
          style={{ border: 0, borderRadius: 12 }}
          title={title}
        />
        <View style={styles.mapOverlayBadge}>
          <Text style={styles.mapBadgeText}>📍 {title}</Text>
        </View>
      </View>
    );
  }

  // Android / Native view using react-native-maps
  try {
    const MapView = require('react-native-maps').default;
    const { Marker } = require('react-native-maps');

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapView}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} title={title} />
        </MapView>
        <View style={styles.mapOverlayBadge}>
          <Text style={styles.mapBadgeText}>📍 {title}</Text>
        </View>
      </View>
    );
  } catch (e) {
    return (
      <View style={styles.mapContainer}>
        <Text style={styles.fallbackText}>
          📍 Active Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    position: 'relative'
  },
  mapView: {
    ...StyleSheet.absoluteFill,
  },
  mapOverlayBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  mapBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900'
  },
  fallbackText: {
    textAlign: 'center', 
    marginTop: 70, 
    color: '#64748B', 
    fontWeight: '800', 
    fontSize: 12
  }
});