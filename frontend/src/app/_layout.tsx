
// import { Stack } from 'expo-router';
// import React, { useEffect } from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// export default function RootLayout() {
//   // Apply a clean global font scaling configuration so no text renders too small
//   useEffect(() => {
//     // @ts-ignore
//     if (Text.defaultProps == null) {
//       // @ts-ignore
//       Text.defaultProps = {};
//     }
//     // @ts-ignore
//     Text.defaultProps.allowFontScaling = true;
//   }, []);

//   return (
//     <SafeAreaProvider>
//       <View style={styles.container}>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//             contentStyle: { backgroundColor: '#ffffff' },
//           }}
//         >
//           <Stack.Screen name="index" />
//           <Stack.Screen name="explore" />
//         </Stack>
//       </View>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     width: '100%',
//     height: '100%',
//   },
// });
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useEffect(() => {
    // @ts-ignore
    if (Text.defaultProps == null) {
      // @ts-ignore
      Text.defaultProps = {};
    }
    // @ts-ignore
    Text.defaultProps.allowFontScaling = true;
  }, []);

  return (
    <SafeAreaProvider style={styles.provider}>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F8FAFC' },
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
  provider: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    width: '100%',
    height: '100%',
  },
});