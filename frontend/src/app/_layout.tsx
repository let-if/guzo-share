// import { Stack } from 'expo-router';
// import React from 'react';
// import { View, StyleSheet, Platform } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <View style={styles.outerContainer}>
//         <View style={styles.mobileFrame}>
//           <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="index" />
//             <Stack.Screen name="explore" />
//           </Stack>
//         </View>
//       </View>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   outerContainer: {
//     flex: 1,
//     backgroundColor: '#090d16', // Dark background framing the mobile app on web browsers
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   mobileFrame: {
//     flex: 1,
//     width: '100%',
//     maxWidth: Platform.OS === 'web' ? 430 : '100%', // Mimics a standard mobile phone width on web
//     maxHeight: Platform.OS === 'web' ? 880 : '100%', // Mimics standard mobile height on web
//     alignSelf: 'center',
//     overflow: 'hidden',
//     backgroundColor: '#ffffff',
//     ...(Platform.OS === 'web' && {
//       boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
//       borderRadius: 24,
//       borderWidth: 4,
//       borderColor: '#1e293b',
//     }),
//   },
// });
import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#ffffff' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="explore" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
  },
});