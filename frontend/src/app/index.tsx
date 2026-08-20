
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView, Platform, Linking, StatusBar, Dimensions } from 'react-native';
// import axios from 'axios';
// import * as Location from 'expo-location';
// import LiveMap from '../components/LiveMap';
// import { estimateRouteDistance, calculateSuggestedFare } from '../utils/fareCalculator';

// const API_URL = 'https://guzo-share.onrender.com/api';

// interface User {
//   id: number;
//   fullName: string;
//   phoneNumber: string;
//   role: 'driver' | 'passenger';
//   telegramHandle?: string;
// }

// interface Trip {
//   id: number;
//   origin: string;
//   destination: string;
//   departureTime: string;
//   availableSeats: number;
//   pricePerSeat: string | number;
//   status: string;
//   driverId: number;
//   driver: {
//     fullName: string;
//     phoneNumber: string;
//     telegramHandle?: string;
//   };
// }

// interface Booking {
//   id: number;
//   tripId: number;
//   seatsBooked: number;
//   status: 'pending' | 'confirmed' | 'rejected';
//   tripOrigin: string;
//   tripDestination: string;
//   departureTime: string;
//   pickupLat?: number;
//   pickupLng?: number;
//   passenger?: {
//     id: number;
//     fullName: string;
//     phoneNumber: string;
//   };
//   trip?: {
//     origin: string;
//     destination: string;
//     status: string;
//     driver: {
//       fullName: string;
//       phoneNumber: string;
//     };
//   };
// }

// interface NotificationItem {
//   id: number;
//   message: string;
//   type: string;
//   isRead: boolean;
//   createdAt: string;
// }

// const t = {
//   en: {
//     appName: "Guzo-Share",
//     subtitle: "PREMIER TRANSIT NETWORK",
//     welcomeTitle: "Smart Ethiopian Intercity Pooling",
//     welcomeSubtitle: "Connect directly with verified drivers and passengers across Addis Ababa, Adama, Hawassa, and nationwide corridors.",
//     signInNavBtn: "Sign In",
//     signUpNavBtn: "Get Started",
//     backBtn: "← Back",
//     signInTitle: "Welcome Back",
//     signInSubtitle: "Authenticate with your registered phone number",
//     signUpTitle: "Create Account",
//     signUpSubtitle: "Join the premier network of commuters & verified drivers",
//     nameLabel: "Full Name",
//     phoneLabel: "Phone Number (e.g. 0911...)",
//     roleLabel: "Account Role",
//     driverRole: "Driver",
//     passengerRole: "Passenger",
//     signInBtn: "Sign In",
//     signUpBtn: "Create Account",
//     logoutBtn: "Sign Out",
//     findRide: "Explore",
//     postTrip: "Publish",
//     myBookings: "Bookings",
//     driverRequests: "Requests",
//     liveFeedTitle: "Live Travel Network",
//     searchOriginPlaceholder: "Search Origin (e.g. Megenagna)...",
//     searchDestPlaceholder: "Search Destination (e.g. Adama)...",
//     searchBtn: "Filter Route",
//     clearBtn: "Reset",
//     noTrips: "No active trips found on this route.",
//     noBookings: "No recent travel activity recorded.",
//     publishTitle: "Publish Travel Route",
//     originPlaceholder: "Origin Area (e.g., Megenagna)",
//     destPlaceholder: "Destination City (e.g., Adama)",
//     timeLabel: "Departure Schedule",
//     timePlaceholder: "e.g., 2026-08-25 14:30",
//     seatsPlaceholder: "Available Seats",
//     pricePlaceholder: "Price per Seat (ETB)",
//     publishBtn: "Publish Route",
//     successMsg: "Route published successfully!",
//     bookSeatBtn: "Request Seat",
//     completeTripBtn: "🏁 Complete Trip",
//     pendingStatus: "Pending Review",
//     confirmedStatus: "Confirmed",
//     rejectedStatus: "Declined",
//     acceptBtn: "Accept",
//     rejectBtn: "Decline",
//     callDriverBtn: "Call Driver",
//     sendLocationBtn: "Share GPS",
//     viewMapBtn: "View Map",
//     errorMsg: "Operation failed",
//     driverLabel: "Driver",
//     seatsLabel: "Seats",
//   },
//   am: {
//     appName: "ጉዞ-ሼር",
//     subtitle: "የኢትዮጵያ የጉዞ ማካፍያ",
//     welcomeTitle: "ዘመናዊ የከተሞች መካከል ጉዞ",
//     welcomeSubtitle: "ከአዲስ አበባ፣ አዳማ፣ ሃዋሳ እና በመላ አገሪቱ ከታመኑ አሽከርካሪዎች እና ተጓዦች ጋር በቀላሉ ይገናኙ።",
//     signInNavBtn: "ግባ",
//     signUpNavBtn: "ተመዝገብ",
//     backBtn: "← ተመለስ",
//     signInTitle: "እንኳን ደህና መጡ",
//     signInSubtitle: "በተመዘገቡበት ስልክ ቁጥር ይግቡ",
//     signUpTitle: "አዲስ መለያ ይፍጠሩ",
//     signUpSubtitle: "ለመጓዝ ወይም ጉዞዎችን ለማካፈል አሁኑኑ ይመዝገቡ",
//     nameLabel: "ሙሉ ስም",
//     phoneLabel: "ስልክ ቁጥር",
//     roleLabel: "የእርስዎን ሚና ይምረጡ",
//     driverRole: "አሽከርካሪ",
//     passengerRole: "ተጓዥ",
//     signInBtn: "ግባ",
//     signUpBtn: "መለያ ፍጠር",
//     logoutBtn: "ውጣ",
//     findRide: "ፈልግ",
//     postTrip: "ለጥፍ",
//     myBookings: "ጉዞዎች",
//     driverRequests: "ጥያቄዎች",
//     liveFeedTitle: "ንቁ የጉዞ መረቦች",
//     searchOriginPlaceholder: "መነሻ (ምሳሌ፦ መገናኛ)...",
//     searchDestPlaceholder: "መዳረሻ (ምሳሌ፦ አዳማ)...",
//     searchBtn: "ፈልግ",
//     clearBtn: "አጥፋ",
//     noTrips: "ምንም ንቁ ጉዞ የለም።",
//     noBookings: "ምንም ምዝገባ የለም።",
//     publishTitle: "የጉዞ መስመር ያስገቡ",
//     originPlaceholder: "መነሻ አካባቢ",
//     destPlaceholder: "መዳረሻ ከተማ",
//     timeLabel: "የመነሻ ሰዓት (ቀን እና ሰዓት)",
//     timePlaceholder: "ምሳሌ፦ 2026-08-25 14:30",
//     seatsPlaceholder: "መቀመጫዎች",
//     pricePlaceholder: "ዋጋ (ብር)",
//     publishBtn: "ለጥፍ",
//     successMsg: "ጉዞው ተመዝግቧል!",
//     bookSeatBtn: "መቀመጫ ጠይቅ",
//     completeTripBtn: "🏁 ጉዞውን አጠናቅ",
//     pendingStatus: "በመጠባበቅ ላይ",
//     confirmedStatus: "ተረጋግጧል",
//     rejectedStatus: "ተቀባይነት አላገኘም",
//     acceptBtn: "ተቀበል",
//     rejectBtn: "ውድቅ አድርግ",
//     callDriverBtn: "ደውል",
//     sendLocationBtn: "መገኛ ላክ",
//     viewMapBtn: "ካርታ አሳይ",
//     errorMsg: "ክዋኔው አልተሳካም",
//     driverLabel: "አሽከርካሪ",
//     seatsLabel: "ቀሪ",
//   }
// };

// export default function HomeScreen() {
//   const [lang, setLang] = useState<'en' | 'am'>('en');
//   const [user, setUser] = useState<User | null>(null);
//   const [authView, setAuthView] = useState<'welcome' | 'signin' | 'signup'>('welcome');

//   const [fullNameInput, setFullNameInput] = useState('');
//   const [phoneInput, setPhoneInput] = useState('');
//   const [selectedRole, setSelectedRole] = useState<'driver' | 'passenger'>('passenger');

//   const [activeTab, setActiveTab] = useState<'feed' | 'post' | 'bookings' | 'requests'>('feed');
//   const [trips, setTrips] = useState<Trip[]>([]);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
//   const [selectedSeatsMap, setSelectedSeatsMap] = useState<{ [key: number]: number }>({});
//   const [ratePerKm, setRatePerKm] = useState('15');
//   const [bannerMessage, setBannerMessage] = useState<string | null>(null);

//   const [inputOrigin, setInputOrigin] = useState('');
//   const [inputDestination, setInputDestination] = useState('');

//   const [origin, setOrigin] = useState('');
//   const [destination, setDestination] = useState('');
//   const [departureTime, setDepartureTime] = useState('');
//   const [availableSeats, setAvailableSeats] = useState('');
//   const [pricePerSeat, setPricePerSeat] = useState('');

//   const currentText = t[lang];

//   const showAlertBanner = (msg: string) => {
//     setBannerMessage(msg);
//     setTimeout(() => setBannerMessage(null), 5000);
//   };

//   const handleSignIn = async () => {
//     if (!phoneInput.trim()) return;
//     try {
//       const response = await axios.post(`${API_URL}/auth/signin`, { phoneNumber: phoneInput.trim() });
//       if (response.data.success) {
//         setUser(response.data.user);
//         setActiveTab(response.data.user.role === 'driver' ? 'post' : 'feed');
//       }
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { error?: string } } };
//       Alert.alert('Error', error.response?.data?.error || currentText.errorMsg);
//     }
//   };

//   const handleSignUp = async () => {
//     if (!fullNameInput.trim() || !phoneInput.trim()) return;
//     try {
//       const response = await axios.post(`${API_URL}/auth/signup`, {
//         fullName: fullNameInput.trim(),
//         phoneNumber: phoneInput.trim(),
//         role: selectedRole
//       });
//       if (response.data.success) {
//         setUser(response.data.user);
//         setActiveTab(response.data.user.role === 'driver' ? 'post' : 'feed');
//       }
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { error?: string } } };
//       Alert.alert('Error', error.response?.data?.error || currentText.errorMsg);
//     }
//   };

//   const fetchTrips = async (originQuery = '', destQuery = '') => {
//     try {
//       const response = await axios.get(`${API_URL}/trips`, { params: { origin: originQuery, destination: destQuery } });
//       if (response.data.success) setTrips(response.data.trips);
//     } catch (err) { console.error(err); }
//   };

//   const fetchData = async () => {
//     if (!user) return;
//     try {
//       if (user.role === 'passenger') {
//         const res = await axios.get(`${API_URL}/trips/passenger/${user.id}/bookings`);
//         if (res.data.success) setBookings(res.data.bookings);
//       } else if (user.role === 'driver') {
//         const res = await axios.get(`${API_URL}/trips/driver/${user.id}/bookings`);
//         if (res.data.success) setBookings(res.data.bookings);
//       }

//       const notifRes = await axios.get(`${API_URL}/notifications/${user.id}`);
//       if (notifRes.data.success) {
//         const fetchedNotifs: NotificationItem[] = notifRes.data.notifications;
//         setNotifications(fetchedNotifs);
//         const unread = fetchedNotifs.filter(n => !n.isRead);
//         if (unread.length > 0) {
//           showAlertBanner(unread[0].message);
//           await axios.patch(`${API_URL}/notifications/${user.id}/read`);
//         }
//       }
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => {
//     if (!user) return;
//     fetchTrips();
//     fetchData();
//     const interval = setInterval(() => {
//       fetchTrips();
//       fetchData();
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [user]);

//   const handleBookSeat = async (tripId: number, seatsToBook: number = 1) => {
//     if (!user) return;
//     try {
//       const response = await axios.post(`${API_URL}/trips/bookings`, { 
//         tripId, 
//         passengerId: user.id, 
//         seatsBooked: seatsToBook 
//       });
//       if (response.data.success) {
//         showAlertBanner(`✨ Successfully requested ${seatsToBook} seat(s)! Awaiting driver confirmation.`);
//         fetchTrips(inputOrigin.trim(), inputDestination.trim());
//         fetchData();
//       }
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { error?: string } } };
//       Alert.alert('Booking Error', error.response?.data?.error || currentText.errorMsg);
//     }
//   };

//   const handleCompleteTrip = async (tripId: number) => {
//     try {
//       const response = await axios.patch(`${API_URL}/trips/${tripId}/complete`);
//       if (response.data.success) {
//         showAlertBanner('🏁 Trip finalized and archived securely!');
//         fetchTrips();
//         fetchData();
//       }
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { error?: string } } };
//       Alert.alert('Error', error.response?.data?.error || currentText.errorMsg);
//     }
//   };

//   const handleSendLocation = async (bookingId: number) => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Error', 'Please enable location permissions in your phone settings.');
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       const { latitude, longitude } = location.coords;
//       const response = await axios.patch(`${API_URL}/trips/bookings/${bookingId}/location`, { latitude, longitude });
//       if (response.data.success) {
//         showAlertBanner('📍 Live GPS coordinates synced with driver radar.');
//         fetchData();
//       }
//     } catch (err) {
//       Alert.alert('Error', 'Failed to retrieve or transmit location. Ensure GPS is turned on.');
//     }
//   };

//   const handleOpenMap = (lat: number, lng: number) => {
//     Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`).catch(() => {});
//   };

//   const handleUpdateBookingStatus = async (bookingId: number, status: 'confirmed' | 'rejected') => {
//     try {
//       const response = await axios.patch(`${API_URL}/trips/bookings/${bookingId}/status`, { status });
//       if (response.data.success) {
//         showAlertBanner(`✨ Request ${status === 'confirmed' ? 'approved' : 'declined'} successfully.`);
//         fetchData();
//       }
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { error?: string } } };
//       Alert.alert('Error', error.response?.data?.error || currentText.errorMsg);
//     }
//   };

//   const handleCallDriver = (phoneNumber: string) => {
//     Linking.openURL(`tel:${phoneNumber}`).catch(() => Alert.alert('Phone', phoneNumber));
//   };

//   const handlePostTrip = async () => {
//     if (!user) return;
//     if (!origin.trim() || !destination.trim() || !availableSeats.trim() || !pricePerSeat.trim()) {
//       Alert.alert('Error', 'Please fill in all required fields.');
//       return;
//     }

//     try {
//       const dateString = departureTime.trim().replace(' ', 'T');
//       const formattedTime = !isNaN(Date.parse(dateString)) ? new Date(dateString).toISOString() : new Date().toISOString();

//       const response = await axios.post(`${API_URL}/trips`, {
//         driverId: user.id, 
//         origin: origin.trim(), 
//         destination: destination.trim(), 
//         departureTime: formattedTime, 
//         availableSeats: Number(availableSeats), 
//         pricePerSeat: Number(pricePerSeat)
//       });

//       if (response.data.success) {
//         showAlertBanner('🚀 Travel route successfully published live.');
//         setOrigin(''); setDestination(''); setDepartureTime(''); setAvailableSeats(''); setPricePerSeat('');
//         setActiveTab('feed'); fetchTrips();
//       }
//     } catch (err: unknown) {
//       const error = err as { response?: { data?: { error?: string } } };
//       Alert.alert('Publish Error', error.response?.data?.error || currentText.errorMsg);
//     }
//   };

//   const unreadCount = notifications.filter(n => !n.isRead).length;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#0F172A" barStyle="light-content" translucent={false} />
      
//       {/* Absolute Protected Header Bar */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerTitle}>ጉዞ-ሼር <Text style={{color: '#10B981'}}>Guzo</Text></Text>
//           <Text style={styles.headerSubtitle}>PREMIER ETHIOPIAN TRANSIT</Text>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.langToggle} onPress={() => setLang(lang === 'en' ? 'am' : 'en')} activeOpacity={0.7}>
//             <Text style={styles.langText}>{lang === 'en' ? 'አማርኛ' : 'English'}</Text>
//           </TouchableOpacity>
//           {user && (
//             <TouchableOpacity style={styles.logoutBtn} onPress={() => { setUser(null); setAuthView('welcome'); }} activeOpacity={0.7}>
//               <Text style={styles.logoutText}>{currentText.logoutBtn}</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {bannerMessage && (
//         <View style={styles.banner}>
//           <Text style={styles.bannerText}>{bannerMessage}</Text>
//         </View>
//       )}

//       {/* Main Scrollable Body */}
//       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
//         {/* Landing Page */}
//         {!user && authView === 'welcome' && (
//           <View style={styles.welcomeWrapper}>
//             <View style={styles.heroCard3D}>
//               <View style={styles.heroGlowOverlay} />
//               <View style={styles.heroBadgeRow}>
//                 <View style={styles.heroIconCircle}>
//                   <Text style={styles.heroEmoji}>🚘⚡</Text>
//                 </View>
//                 <View style={styles.livePulseBadge}>
//                   <View style={styles.pulseDot} />
//                   <Text style={styles.livePulseText}>LIVE INTERCITY POOL</Text>
//                 </View>
//               </View>

//               <Text style={styles.authTitle}>{currentText.welcomeTitle}</Text>
//               <Text style={styles.authSubtitle}>{currentText.welcomeSubtitle}</Text>

//               <View style={styles.metricStrip3D}>
//                 <View style={styles.metricItem}>
//                   <Text style={styles.metricVal}>100%</Text>
//                   <Text style={styles.metricLbl}>Verified IDs</Text>
//                 </View>
//                 <View style={styles.metricDivider} />
//                 <View style={styles.metricItem}>
//                   <Text style={styles.metricVal}>40-60%</Text>
//                   <Text style={styles.metricLbl}>Fare Savings</Text>
//                 </View>
//                 <View style={styles.metricDivider} />
//                 <View style={styles.metricItem}>
//                   <Text style={styles.metricVal}>GPS</Text>
//                   <Text style={styles.metricLbl}>Live Radar</Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.welcomeButtonGroup}>
//               <TouchableOpacity style={styles.glowPrimaryBtn} onPress={() => setAuthView('signup')} activeOpacity={0.85}>
//                 <Text style={styles.glowPrimaryBtnText}>⚡ {currentText.signUpNavBtn}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.glossSecondaryBtn} onPress={() => setAuthView('signin')} activeOpacity={0.85}>
//                 <Text style={styles.glossSecondaryBtnText}>{currentText.signInNavBtn}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* Sign In Screen */}
//         {!user && authView === 'signin' && (
//           <View style={styles.authContainer}>
//             <TouchableOpacity onPress={() => setAuthView('welcome')} style={styles.backLink} activeOpacity={0.7}>
//               <Text style={styles.backLinkText}>{currentText.backBtn}</Text>
//             </TouchableOpacity>
//             <Text style={styles.authTitle}>{currentText.signInTitle}</Text>
//             <Text style={styles.authSubtitle}>{currentText.signInSubtitle}</Text>

//             <Text style={styles.label}>{currentText.phoneLabel}</Text>
//             <TextInput style={styles.input3D} placeholder="0911223344" placeholderTextColor="#94A3B8" keyboardType="phone-pad" value={phoneInput} onChangeText={setPhoneInput} />

//             <TouchableOpacity style={styles.glowPrimaryBtn} onPress={handleSignIn} activeOpacity={0.8}>
//               <Text style={styles.glowPrimaryBtnText}>{currentText.signInBtn}</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Sign Up Screen */}
//         {!user && authView === 'signup' && (
//           <View style={styles.authContainer}>
//             <TouchableOpacity onPress={() => setAuthView('welcome')} style={styles.backLink} activeOpacity={0.7}>
//               <Text style={styles.backLinkText}>{currentText.backBtn}</Text>
//             </TouchableOpacity>
//             <Text style={styles.authTitle}>{currentText.signUpTitle}</Text>
//             <Text style={styles.authSubtitle}>{currentText.signUpSubtitle}</Text>

//             <Text style={styles.label}>{currentText.nameLabel}</Text>
//             <TextInput style={styles.input3D} placeholder="Abebe Kebede" placeholderTextColor="#94A3B8" value={fullNameInput} onChangeText={setFullNameInput} />

//             <Text style={styles.label}>{currentText.phoneLabel}</Text>
//             <TextInput style={styles.input3D} placeholder="0911223344" placeholderTextColor="#94A3B8" keyboardType="phone-pad" value={phoneInput} onChangeText={setPhoneInput} />

//             <Text style={styles.label}>{currentText.roleLabel}</Text>
//             <View style={styles.roleRow}>
//               <TouchableOpacity style={[styles.roleCard3D, selectedRole === 'passenger' && styles.selectedRoleCard3D]} onPress={() => setSelectedRole('passenger')} activeOpacity={0.8}>
//                 <Text style={[styles.roleText, selectedRole === 'passenger' && styles.selectedRoleText3D]}>{currentText.passengerRole}</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={[styles.roleCard3D, selectedRole === 'driver' && styles.selectedRoleCard3D]} onPress={() => setSelectedRole('driver')} activeOpacity={0.8}>
//                 <Text style={[styles.roleText, selectedRole === 'driver' && styles.selectedRoleText3D]}>{currentText.driverRole}</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity style={styles.glowPrimaryBtn} onPress={handleSignUp} activeOpacity={0.8}>
//               <Text style={styles.glowPrimaryBtnText}>{currentText.signUpBtn}</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Authenticated Dashboard */}
//         {user && (
//           <View style={styles.dashboardBody}>
//             <View style={styles.tabContainer3D}>
//               <TouchableOpacity style={[styles.tab3D, activeTab === 'feed' && styles.activeTab3D]} onPress={() => setActiveTab('feed')} activeOpacity={0.8}>
//                 <Text style={[styles.tabText3D, activeTab === 'feed' && styles.activeTabText3D]}>{currentText.findRide}</Text>
//               </TouchableOpacity>

//               {user.role === 'passenger' && (
//                 <TouchableOpacity style={[styles.tab3D, activeTab === 'bookings' && styles.activeTab3D]} onPress={() => setActiveTab('bookings')} activeOpacity={0.8}>
//                   <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6}}>
//                     <Text style={[styles.tabText3D, activeTab === 'bookings' && styles.activeTabText3D]}>{currentText.myBookings}</Text>
//                     {unreadCount > 0 && <View style={styles.notificationDot} />}
//                   </View>
//                 </TouchableOpacity>
//               )}

//               {user.role === 'driver' && (
//                 <>
//                   <TouchableOpacity style={[styles.tab3D, activeTab === 'post' && styles.activeTab3D]} onPress={() => setActiveTab('post')} activeOpacity={0.8}>
//                     <Text style={[styles.tabText3D, activeTab === 'post' && styles.activeTabText3D]}>{currentText.postTrip}</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.tab3D, activeTab === 'requests' && styles.activeTab3D]} onPress={() => setActiveTab('requests')} activeOpacity={0.8}>
//                     <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6}}>
//                       <Text style={[styles.tabText3D, activeTab === 'requests' && styles.activeTabText3D]}>{currentText.driverRequests}</Text>
//                       {unreadCount > 0 && <View style={styles.notificationDot} />}
//                     </View>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>

//             {activeTab === 'feed' && (
//               <View style={styles.content}>
//                 <View style={styles.searchCard3D}>
//                   <Text style={styles.searchHeader}>{currentText.liveFeedTitle}</Text>
//                   <TextInput style={styles.input3D} placeholder={currentText.searchOriginPlaceholder} placeholderTextColor="#94A3B8" value={inputOrigin} onChangeText={setInputOrigin} />
//                   <TextInput style={styles.input3D} placeholder={currentText.searchDestPlaceholder} placeholderTextColor="#94A3B8" value={inputDestination} onChangeText={setInputDestination} />
//                   <View style={styles.searchButtonRow}>
//                     <TouchableOpacity style={styles.glowPrimaryBtnSmall} onPress={() => fetchTrips(inputOrigin.trim(), inputDestination.trim())} activeOpacity={0.8}>
//                       <Text style={styles.glowPrimaryBtnTextSmall}>{currentText.searchBtn}</Text>
//                     </TouchableOpacity>
//                     {(inputOrigin !== '' || inputDestination !== '') ? (
//                       <TouchableOpacity style={styles.glossSecondaryBtnSmall} onPress={() => { setInputOrigin(''); setInputDestination(''); fetchTrips('', ''); }} activeOpacity={0.8}>
//                         <Text style={styles.glossSecondaryBtnTextSmall}>{currentText.clearBtn}</Text>
//                       </TouchableOpacity>
//                     ) : null}
//                   </View>
//                 </View>

//                 {trips.length === 0 ? (
//                   <Text style={styles.emptyText}>{currentText.noTrips}</Text>
//                 ) : (
//                   trips.map((item) => {
//                     const currentSeats = selectedSeatsMap[item.id] || 1;
//                     return (
//                       <View key={item.id.toString()} style={styles.tripCard3D}>
//                         <View style={styles.routeRow}>
//                           <Text style={styles.routeText}>{item.origin} <Text style={{color: '#10B981'}}>➔</Text> {item.destination}</Text>
//                           <Text style={styles.priceBadge}>{item.pricePerSeat} ETB</Text>
//                         </View>
//                         <Text style={styles.detailText}>🕒 {new Date(item.departureTime).toLocaleString()}</Text>
//                         <Text style={styles.detailText}>💺 {currentText.seatsLabel}: <Text style={{fontWeight: '900', color: '#10B981'}}>{item.availableSeats}</Text></Text>
//                         <Text style={styles.driverText}>👤 {currentText.driverLabel}: {item.driver.fullName} | 📞 {item.driver.phoneNumber}</Text>
                        
//                         {user.role === 'passenger' && (
//                           <View style={styles.seatSelectorContainer}>
//                             <Text style={styles.seatSelectorLabel}>Seats to Request:</Text>
//                             <View style={styles.seatCounterRow}>
//                               <TouchableOpacity 
//                                 style={styles.seatControlBtn} 
//                                 onPress={() => {
//                                   if (currentSeats > 1) {
//                                     setSelectedSeatsMap({ ...selectedSeatsMap, [item.id]: currentSeats - 1 });
//                                   }
//                                 }}
//                                 activeOpacity={0.7}
//                               >
//                                 <Text style={styles.seatControlText}>-</Text>
//                               </TouchableOpacity>

//                               <Text style={styles.seatCountText}>{currentSeats}</Text>

//                               <TouchableOpacity 
//                                 style={styles.seatControlBtn} 
//                                 onPress={() => {
//                                   if (currentSeats < item.availableSeats) {
//                                     setSelectedSeatsMap({ ...selectedSeatsMap, [item.id]: currentSeats + 1 });
//                                   }
//                                 }}
//                                 activeOpacity={0.7}
//                               >
//                                 <Text style={styles.seatControlText}>+</Text>
//                               </TouchableOpacity>
//                             </View>

//                             <TouchableOpacity style={styles.actionBtnGlowDark} onPress={() => handleBookSeat(item.id, currentSeats)} activeOpacity={0.8}>
//                               <Text style={styles.actionBtnTextDark}>{currentText.bookSeatBtn} ({currentSeats})</Text>
//                             </TouchableOpacity>
//                           </View>
//                         )}

//                         {user.role === 'driver' && user.id === item.driverId && (
//                           <TouchableOpacity style={styles.actionBtnCrimson} onPress={() => handleCompleteTrip(item.id)} activeOpacity={0.8}>
//                             <Text style={styles.actionBtnTextLight}>{currentText.completeTripBtn}</Text>
//                           </TouchableOpacity>
//                         )}
//                       </View>
//                     );
//                   })
//                 )}
//               </View>
//             )}

//             {activeTab === 'bookings' && user.role === 'passenger' && (
//               <View style={styles.content}>
//                 <Text style={styles.formTitle}>My Bookings & Radar</Text>
//                 {bookings.length === 0 ? (
//                   <Text style={styles.emptyText}>{currentText.noBookings}</Text>
//                 ) : (
//                   bookings.map((item) => (
//                     <View key={item.id.toString()} style={[styles.tripCard3D, item.status === 'confirmed' && { borderColor: '#10B981', backgroundColor: '#F0FDF4' }]}>
//                       <Text style={styles.routeText}>Route: {item.trip?.origin} ➔ {item.trip?.destination}</Text>
//                       <Text style={styles.detailText}>💺 Seats Booked: <Text style={{fontWeight: '900', color: '#10B981'}}>{item.seatsBooked}</Text></Text>
//                       <Text style={styles.detailText}>Status: <Text style={{fontWeight: '900', color: item.status === 'confirmed' ? '#10B981' : item.status === 'rejected' ? '#EF4444' : '#F59E0B'}}>
//                         {item.status === 'confirmed' ? currentText.confirmedStatus : item.status === 'rejected' ? currentText.rejectedStatus : currentText.pendingStatus}
//                       </Text></Text>

//                       {item.pickupLat && item.pickupLng && (
//                         <LiveMap latitude={item.pickupLat} longitude={item.pickupLng} title="Your Shared Pickup Point" />
//                       )}

//                       {item.status === 'confirmed' && item.trip && (
//                         <View style={styles.buttonActionGroup}>
//                           <TouchableOpacity style={styles.actionBtnEmerald} onPress={() => handleCallDriver(item.trip!.driver.phoneNumber)} activeOpacity={0.8}>
//                             <Text style={styles.actionBtnTextLight}>{currentText.callDriverBtn}</Text>
//                           </TouchableOpacity>
//                           <TouchableOpacity style={styles.actionBtnIndigo} onPress={() => handleSendLocation(item.id)} activeOpacity={0.8}>
//                             <Text style={styles.actionBtnTextLight}>{currentText.sendLocationBtn}</Text>
//                           </TouchableOpacity>
//                         </View>
//                       )}
//                     </View>
//                   ))
//                 )}
//               </View>
//             )}

//             {activeTab === 'requests' && user.role === 'driver' && (
//               <View style={styles.content}>
//                 <Text style={styles.formTitle}>Incoming Passenger Radar</Text>
//                 {bookings.length === 0 ? (
//                   <Text style={styles.emptyText}>{currentText.noBookings}</Text>
//                 ) : (
//                   bookings.map((item) => (
//                     <View key={item.id.toString()} style={styles.tripCard3D}>
//                       <Text style={styles.routeText}>Route: {item.tripOrigin} ➔ {item.tripDestination}</Text>
//                       <Text style={styles.detailText}>👤 Booker: {item.passenger?.fullName} | 📞 {item.passenger?.phoneNumber}</Text>
//                       <Text style={styles.detailText}>💺 Seats Requested: <Text style={{fontWeight: '900', color: '#10B981'}}>{item.seatsBooked}</Text></Text>
//                       <Text style={styles.detailText}>Status: <Text style={{fontWeight: '900', color: item.status === 'confirmed' ? '#10B981' : '#EF4444'}}>{item.status.toUpperCase()}</Text></Text>

//                       {item.pickupLat && item.pickupLng && (
//                         <>
//                           <LiveMap latitude={item.pickupLat} longitude={item.pickupLng} title={`${item.passenger?.fullName}'s Location`} />
//                           <TouchableOpacity style={styles.actionBtnAmber} onPress={() => handleOpenMap(item.pickupLat!, item.pickupLng!)} activeOpacity={0.8}>
//                             <Text style={styles.actionBtnTextLight}>{currentText.viewMapBtn}</Text>
//                           </TouchableOpacity>
//                         </>
//                       )}

//                       {item.status === 'pending' && (
//                         <View style={styles.buttonActionGroup}>
//                           <TouchableOpacity style={styles.actionBtnEmerald} onPress={() => handleUpdateBookingStatus(item.id, 'confirmed')} activeOpacity={0.8}>
//                             <Text style={styles.actionBtnTextLight}>{currentText.acceptBtn}</Text>
//                           </TouchableOpacity>
//                           <TouchableOpacity style={styles.actionBtnCrimson} onPress={() => handleUpdateBookingStatus(item.id, 'rejected')} activeOpacity={0.8}>
//                             <Text style={styles.actionBtnTextLight}>{currentText.rejectBtn}</Text>
//                           </TouchableOpacity>
//                         </View>
//                       )}
//                     </View>
//                   ))
//                 )}
//               </View>
//             )}

//             {activeTab === 'post' && user.role === 'driver' && (
//               <View style={styles.formContainer}>
//                 <Text style={styles.formTitle}>{currentText.publishTitle}</Text>
                
//                 <Text style={styles.label}>{currentText.originPlaceholder}</Text>
//                 <TextInput style={styles.input3D} placeholder="Megenagna, Addis Ababa" placeholderTextColor="#94A3B8" value={origin} onChangeText={setOrigin} />
                
//                 <Text style={styles.label}>{currentText.destPlaceholder}</Text>
//                 <TextInput style={styles.input3D} placeholder="Adama" placeholderTextColor="#94A3B8" value={destination} onChangeText={setDestination} />
                
//                 <Text style={styles.label}>{currentText.timeLabel}</Text>
//                 <TextInput style={styles.input3D} placeholder="2026-08-25 14:30" placeholderTextColor="#94A3B8" value={departureTime} onChangeText={setDepartureTime} />

//                 <Text style={styles.label}>{currentText.seatsPlaceholder}</Text>
//                 <TextInput style={styles.input3D} placeholder="3" placeholderTextColor="#94A3B8" keyboardType="numeric" value={availableSeats} onChangeText={setAvailableSeats} />

//                 <View style={styles.fareCalculatorBox}>
//                   <Text style={styles.fareCalculatorHeader}>💡 Smart Fare Estimator</Text>
//                   <Text style={styles.label}>Rate per KM (ETB)</Text>
//                   <TextInput 
//                     style={[styles.input3D, { marginBottom: 8 }]} 
//                     placeholder="15" 
//                     placeholderTextColor="#94A3B8" 
//                     keyboardType="numeric" 
//                     value={ratePerKm} 
//                     onChangeText={setRatePerKm} 
//                   />

//                   {origin.trim() !== '' && destination.trim() !== '' && (
//                     <View style={styles.farePreviewRow}>
//                       <Text style={styles.farePreviewText}>
//                         Est. Distance: <Text style={{fontWeight: '900', color: '#0F172A'}}>{estimateRouteDistance(origin, destination)} km</Text>
//                       </Text>
//                       <TouchableOpacity 
//                         style={styles.autoFillBtn}
//                         onPress={() => {
//                           const suggested = calculateSuggestedFare(origin, destination, Number(ratePerKm || 15));
//                           setPricePerSeat(suggested.toString());
//                           showAlertBanner(`✨ Auto-calculated fare set to ${suggested} ETB!`);
//                         }}
//                         activeOpacity={0.8}
//                       >
//                         <Text style={styles.autoFillBtnText}>Auto-Fill Fare</Text>
//                       </TouchableOpacity>
//                     </View>
//                   )}
//                 </View>
                
//                 <Text style={styles.label}>{currentText.pricePlaceholder}</Text>
//                 <TextInput style={styles.input3D} placeholder="350" placeholderTextColor="#94A3B8" keyboardType="numeric" value={pricePerSeat} onChangeText={setPricePerSeat} />

//                 <TouchableOpacity style={styles.glowPrimaryBtn} onPress={handlePostTrip} activeOpacity={0.8}>
//                   <Text style={styles.glowPrimaryBtnText}>{currentText.publishBtn}</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#0F172A', // Fills the status bar zone natively
//   },
//   header: { 
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     backgroundColor: '#0F172A',
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#1E293B',
//     paddingTop: Platform.OS === 'android' ? 12 : 14
//   },
//   headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
//   headerSubtitle: { fontSize: 11, color: '#10B981', fontWeight: '900', marginTop: 2, letterSpacing: 1 },
//   langToggle: {
//     backgroundColor: '#1E293B',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#334155'
//   },
//   langText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
//   logoutBtn: {
//     backgroundColor: '#EF4444',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12
//   },
//   logoutText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
//   banner: { 
//     backgroundColor: '#ECFDF5', 
//     padding: 12, 
//     marginHorizontal: 14, 
//     marginTop: 10, 
//     borderRadius: 12, 
//     borderWidth: 1, 
//     borderColor: '#A7F3D0' 
//   },
//   bannerText: { color: '#065F46', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  
//   scrollContainer: { 
//     flexGrow: 1,
//     backgroundColor: '#F8FAFC',
//     paddingBottom: 60
//   },
//   welcomeWrapper: {
//     padding: 16
//   },
//   heroCard3D: {
//     width: '100%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     padding: 20,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#E2E8F0'
//   },
//   heroGlowOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 6,
//     backgroundColor: '#10B981',
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24
//   },
//   heroBadgeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12
//   },
//   heroIconCircle: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: '#ECFDF5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#A7F3D0'
//   },
//   heroEmoji: { fontSize: 24 },
//   livePulseBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F0FDF4',
//     borderWidth: 1,
//     borderColor: '#86EFAC',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//     gap: 6
//   },
//   pulseDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#10B981'
//   },
//   livePulseText: {
//     fontSize: 11,
//     fontWeight: '900',
//     color: '#065F46',
//     letterSpacing: 0.8
//   },
//   authTitle: { 
//     fontSize: 24, 
//     fontWeight: '900', 
//     color: '#0F172A', 
//     marginBottom: 6, 
//     letterSpacing: -0.5 
//   },
//   authSubtitle: { 
//     fontSize: 14, 
//     color: '#64748B', 
//     lineHeight: 20, 
//     fontWeight: '600',
//     marginBottom: 16
//   },
//   metricStrip3D: {
//     flexDirection: 'row',
//     backgroundColor: '#F8FAFC',
//     borderRadius: 16,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     justifyContent: 'space-around',
//     alignItems: 'center'
//   },
//   metricItem: {
//     alignItems: 'center'
//   },
//   metricVal: {
//     fontSize: 16,
//     fontWeight: '900',
//     color: '#10B981'
//   },
//   metricLbl: {
//     fontSize: 11,
//     fontWeight: '800',
//     color: '#64748B',
//     marginTop: 2,
//     textTransform: 'uppercase'
//   },
//   metricDivider: {
//     width: 1,
//     height: 28,
//     backgroundColor: '#E2E8F0'
//   },
//   welcomeButtonGroup: { 
//     width: '100%', 
//     gap: 12, 
//     marginBottom: 24 
//   },

//   authContainer: { padding: 20, flexGrow: 1, backgroundColor: '#F8FAFC' },
//   backLink: { marginBottom: 12 },
//   backLinkText: { fontSize: 14, fontWeight: '800', color: '#10B981' },
//   label: { fontSize: 13, fontWeight: '900', color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
//   input3D: { backgroundColor: '#FFFFFF', color: '#0F172A', padding: 14, borderRadius: 12, marginBottom: 14, fontSize: 16, borderWidth: 1, borderColor: '#CBD5E1', fontWeight: '700' },
//   roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
//   roleCard3D: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', backgroundColor: '#FFFFFF' },
//   selectedRoleCard3D: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
//   roleText: { fontSize: 14, fontWeight: '800', color: '#64748B' },
//   selectedRoleText3D: { color: '#10B981' },
//   glowPrimaryBtn: { backgroundColor: '#10B981', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, alignItems: 'center', elevation: 6 },
//   glowPrimaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
//   glossSecondaryBtn: { backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1', elevation: 2 },
//   glossSecondaryBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
//   glowPrimaryBtnSmall: { flex: 2, backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
//   glowPrimaryBtnTextSmall: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
//   glossSecondaryBtnSmall: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
//   glossSecondaryBtnTextSmall: { color: '#0F172A', fontSize: 14, fontWeight: '800' },
  
//   dashboardBody: { width: '100%' },
//   tabContainer3D: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 6, margin: 12, borderRadius: 14 },
//   tab3D: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
//   activeTab3D: { backgroundColor: '#0F172A', elevation: 3 },
//   tabText3D: { color: '#475569', fontWeight: '800', fontSize: 14 },
//   activeTabText3D: { color: '#FFFFFF' },
//   notificationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
//   content: { paddingHorizontal: 12 },
//   searchCard3D: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
//   searchHeader: { fontSize: 14, fontWeight: '900', color: '#0F172A', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
//   searchButtonRow: { flexDirection: 'row', gap: 8 },
  
//   tripCard3D: { 
//     backgroundColor: '#FFFFFF', 
//     padding: 16, 
//     borderRadius: 18, 
//     marginBottom: 14, 
//     borderWidth: 1, 
//     borderColor: '#E2E8F0', 
//     borderLeftWidth: 4, 
//     borderLeftColor: '#10B981' 
//   },
//   routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   routeText: { fontSize: 16, fontWeight: '900', color: '#0F172A', letterSpacing: -0.2 },
//   priceBadge: { 
//     fontSize: 14, 
//     fontWeight: '900', 
//     color: '#FFFFFF', 
//     backgroundColor: '#10B981', 
//     paddingHorizontal: 10, 
//     paddingVertical: 4, 
//     borderRadius: 8,
//     overflow: 'hidden'
//   },
//   detailText: { color: '#475569', fontSize: 14, marginBottom: 5, fontWeight: '700' },
//   driverText: { color: '#10B981', fontSize: 14, marginTop: 6, fontWeight: '800' },
  
//   seatSelectorContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
//   seatSelectorLabel: { fontSize: 13, fontWeight: '900', color: '#64748B', marginBottom: 8, textTransform: 'uppercase' },
//   seatCounterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
//   seatControlBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
//   seatControlText: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
//   seatCountText: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  
//   fareCalculatorBox: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 },
//   fareCalculatorHeader: { fontSize: 14, fontWeight: '900', color: '#10B981', marginBottom: 10, textTransform: 'uppercase' },
//   farePreviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
//   farePreviewText: { fontSize: 14, color: '#475569', fontWeight: '700' },
//   autoFillBtn: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
//   autoFillBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },

//   buttonActionGroup: { flexDirection: 'row', gap: 8, marginTop: 10 },
//   actionBtnGlowDark: { backgroundColor: '#0F172A', marginTop: 10, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
//   actionBtnTextDark: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
//   actionBtnEmerald: { flex: 1, backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
//   actionBtnIndigo: { flex: 1, backgroundColor: '#4F46E5', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
//   actionBtnCrimson: { flex: 1, backgroundColor: '#EF4444', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
//   actionBtnAmber: { backgroundColor: '#F59E0B', marginTop: 10, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
//   actionBtnTextLight: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
//   emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 30, fontSize: 15, fontWeight: '800' },
//   formContainer: { padding: 16 },
//   formTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 12 },
// });
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView, Platform, Linking, StatusBar } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import LiveMap from '../components/LiveMap';
import { estimateRouteDistance, calculateSuggestedFare } from '../utils/fareCalculator';

const API_URL = 'https://guzo-share.onrender.com/api';

interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  role: 'driver' | 'passenger';
  telegramHandle?: string;
}

interface Trip {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: string | number;
  status: string;
  driverId: number;
  driver?: {
    fullName: string;
    phoneNumber: string;
    telegramHandle?: string;
  };
}

interface Booking {
  id: number;
  tripId: number;
  seatsBooked: number;
  status: 'pending' | 'confirmed' | 'rejected';
  tripOrigin?: string;
  tripDestination?: string;
  departureTime?: string;
  pickupLat?: number;
  pickupLng?: number;
  passenger?: {
    id: number;
    fullName: string;
    phoneNumber: string;
  };
  trip?: {
    origin: string;
    destination: string;
    status: string;
    driver?: {
      fullName: string;
      phoneNumber: string;
    };
  };
}

interface NotificationItem {
  id: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const t = {
  en: {
    appName: "Guzo-Share",
    subtitle: "PREMIER TRANSIT NETWORK",
    welcomeTitle: "Smart Ethiopian Intercity Pooling",
    welcomeSubtitle: "Connect directly with verified drivers and passengers across Addis Ababa, Adama, Hawassa, and nationwide corridors.",
    signInNavBtn: "Sign In",
    signUpNavBtn: "Get Started",
    backBtn: "← Back",
    signInTitle: "Welcome Back",
    signInSubtitle: "Authenticate with your registered phone number",
    signUpTitle: "Create Account",
    signUpSubtitle: "Join the premier network of commuters & verified drivers",
    nameLabel: "Full Name",
    phoneLabel: "Phone Number (e.g. 0911...)",
    roleLabel: "Account Role",
    driverRole: "Driver",
    passengerRole: "Passenger",
    signInBtn: "Sign In",
    signUpBtn: "Create Account",
    logoutBtn: "Sign Out",
    findRide: "Explore",
    postTrip: "Publish",
    myBookings: "Bookings",
    driverRequests: "Requests",
    liveFeedTitle: "Live Travel Network",
    searchOriginPlaceholder: "Search Origin (e.g. Megenagna)...",
    searchDestPlaceholder: "Search Destination (e.g. Adama)...",
    searchBtn: "Filter Route",
    clearBtn: "Reset",
    noTrips: "No active trips found on this route.",
    noBookings: "No recent travel activity recorded.",
    publishTitle: "Publish Travel Route",
    originPlaceholder: "Origin Area (e.g., Megenagna)",
    destPlaceholder: "Destination City (e.g., Adama)",
    timeLabel: "Departure Schedule",
    timePlaceholder: "e.g., 2026-08-25 14:30",
    seatsPlaceholder: "Available Seats",
    pricePlaceholder: "Price per Seat (ETB)",
    publishBtn: "Publish Route",
    successMsg: "Route published successfully!",
    bookSeatBtn: "Request Seat",
    completeTripBtn: "🏁 Complete Trip",
    pendingStatus: "Pending Review",
    confirmedStatus: "Confirmed",
    rejectedStatus: "Declined",
    acceptBtn: "Accept",
    rejectBtn: "Decline",
    callDriverBtn: "Call Driver",
    sendLocationBtn: "Share GPS",
    viewMapBtn: "View Map",
    errorMsg: "Operation failed",
    driverLabel: "Driver",
    seatsLabel: "Seats",
  },
  am: {
    appName: "ጉዞ-ሼር",
    subtitle: "የኢትዮጵያ የጉዞ ማካፍያ",
    welcomeTitle: "ዘመናዊ የከተሞች መካከል ጉዞ",
    welcomeSubtitle: "ከአዲስ አበባ፣ አዳማ፣ ሃዋሳ እና በመላ አገሪቱ ከታመኑ አሽከርካሪዎች እና ተጓዦች ጋር በቀላሉ ይገናኙ።",
    signInNavBtn: "ግባ",
    signUpNavBtn: "ተመዝገብ",
    backBtn: "← ተመለስ",
    signInTitle: "እንኳን ደህና መጡ",
    signInSubtitle: "በተመዘገቡበት ስልክ ቁጥር ይግቡ",
    signUpTitle: "አዲስ መለያ ይፍጠሩ",
    signUpSubtitle: "ለመጓዝ ወይም ጉዞዎችን ለማካፈል አሁኑኑ ይመዝገቡ",
    nameLabel: "ሙሉ ስም",
    phoneLabel: "ስልክ ቁጥር",
    roleLabel: "የእርስዎን ሚና ይምረጡ",
    driverRole: "አሽከርካሪ",
    passengerRole: "ተጓዥ",
    signInBtn: "ግባ",
    signUpBtn: "መለያ ፍጠር",
    logoutBtn: "ውጣ",
    findRide: "ፈልግ",
    postTrip: "ለጥፍ",
    myBookings: "ጉዞዎች",
    driverRequests: "ጥያቄዎች",
    liveFeedTitle: "ንቁ የጉዞ መረቦች",
    searchOriginPlaceholder: "መነሻ (ምሳሌ፦ መገናኛ)...",
    searchDestPlaceholder: "መዳረሻ (ምሳሌ፦ አዳማ)...",
    searchBtn: "ፈልግ",
    clearBtn: "አጥፋ",
    noTrips: "ምንም ንቁ ጉዞ የለም።",
    noBookings: "ምንም ምዝገባ የለም።",
    publishTitle: "የጉዞ መስመር ያስገቡ",
    originPlaceholder: "መነሻ አካባቢ",
    destPlaceholder: "መዳረሻ ከተማ",
    timeLabel: "የመነሻ ሰዓት (ቀን እና ሰዓት)",
    timePlaceholder: "ምሳሌ፦ 2026-08-25 14:30",
    seatsPlaceholder: "መቀመጫዎች",
    pricePlaceholder: "ዋጋ (ብር)",
    publishBtn: "ለጥፍ",
    successMsg: "ጉዞው ተመዝግቧል!",
    bookSeatBtn: "መቀመጫ ጠይቅ",
    completeTripBtn: "🏁 ጉዞውን አጠናቅ",
    pendingStatus: "በመጠባበቅ ላይ",
    confirmedStatus: "ተረጋግጧል",
    rejectedStatus: "ተቀባይነት አላገኘም",
    acceptBtn: "ተቀበል",
    rejectBtn: "ውድቅ አድርግ",
    callDriverBtn: "ደውል",
    sendLocationBtn: "መገኛ ላክ",
    viewMapBtn: "ካርታ አሳይ",
    errorMsg: "ክዋኔው አልተሳካም",
    driverLabel: "አሽከርካሪ",
    seatsLabel: "ቀሪ",
  }
};

export default function HomeScreen() {
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'welcome' | 'signin' | 'signup'>('welcome');

  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedRole, setSelectedRole] = useState<'driver' | 'passenger'>('passenger');

  const [activeTab, setActiveTab] = useState<'feed' | 'post' | 'bookings' | 'requests'>('feed');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [selectedSeatsMap, setSelectedSeatsMap] = useState<{ [key: number]: number }>({});
  const [ratePerKm, setRatePerKm] = useState('15');
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const [inputOrigin, setInputOrigin] = useState('');
  const [inputDestination, setInputDestination] = useState('');

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState('');

  const currentText = t[lang];

  const showAlertBanner = (msg: string) => {
    setBannerMessage(msg);
    setTimeout(() => setBannerMessage(null), 5000);
  };

  const handleSignIn = async () => {
    if (!phoneInput.trim()) return;
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, { phoneNumber: phoneInput.trim() });
      if (response.data.success) {
        setUser(response.data.user);
        setActiveTab(response.data.user.role === 'driver' ? 'post' : 'feed');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      Alert.alert('Error', error.response?.data?.error || currentText.errorMsg);
    }
  };

  const handleSignUp = async () => {
    if (!fullNameInput.trim() || !phoneInput.trim()) return;
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        fullName: fullNameInput.trim(),
        phoneNumber: phoneInput.trim(),
        role: selectedRole
      });
      if (response.data.success) {
        setUser(response.data.user);
        setActiveTab(response.data.user.role === 'driver' ? 'post' : 'feed');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      Alert.alert('Error', error.response?.data?.error || currentText.errorMsg);
    }
  };

  const fetchTrips = async (originQuery = '', destQuery = '') => {
    try {
      const response = await axios.get(`${API_URL}/trips`, { params: { origin: originQuery, destination: destQuery } });
      if (response.data.success) setTrips(response.data.trips);
    } catch (err) { console.error(err); }
  };

  const fetchData = async () => {
    if (!user) return;
    try {
      if (user.role === 'passenger') {
        const res = await axios.get(`${API_URL}/trips/passenger/${user.id}/bookings`);
        if (res.data.success) setBookings(res.data.bookings);
      } else if (user.role === 'driver') {
        const res = await axios.get(`${API_URL}/trips/driver/${user.id}/bookings`);
        if (res.data.success) setBookings(res.data.bookings);
      }

      const notifRes = await axios.get(`${API_URL}/notifications/${user.id}`);
      if (notifRes.data.success) {
        const fetchedNotifs: NotificationItem[] = notifRes.data.notifications;
        setNotifications(fetchedNotifs);
        const unread = fetchedNotifs.filter(n => !n.isRead);
        if (unread.length > 0) {
          showAlertBanner(unread[0].message);
          await axios.patch(`${API_URL}/notifications/${user.id}/read`);
        }
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!user) return;
    fetchTrips();
    fetchData();
    const interval = setInterval(() => {
      fetchTrips();
      fetchData();
    }, 4000);
    return () => clearInterval(interval);
  }, [user]);

  const handleBookSeat = async (tripId: number, seatsToBook: number = 1) => {
    if (!user) return;
    try {
      const response = await axios.post(`${API_URL}/trips/bookings`, { 
        tripId, 
        passengerId: user.id, 
        seatsBooked: seatsToBook 
      });
      if (response.data.success) {
        showAlertBanner(`✨ Successfully requested ${seatsToBook} seat(s)! Awaiting driver confirmation.`);
        fetchTrips(inputOrigin.trim(), inputDestination.trim());
        fetchData();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      Alert.alert('Booking Error', error.response?.data?.error || currentText.errorMsg);
    }
  };

  const handleCompleteTrip = async (tripId: number) => {
    try {
      const response = await axios.patch(`${API_URL}/trips/${tripId}/complete`);
      if (response.data.success) {
        showAlertBanner('🏁 Trip finalized and archived securely!');
        fetchTrips();
        fetchData();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      Alert.alert('Error', error.response?.data?.error || currentText.errorMsg);
    }
  };

  const handleSendLocation = async (bookingId: number) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Error', 'Please enable location permissions in your phone settings.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const response = await axios.patch(`${API_URL}/trips/bookings/${bookingId}/location`, { latitude, longitude });
      if (response.data.success) {
        showAlertBanner('📍 Live GPS coordinates synced with driver radar.');
        fetchData();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to retrieve or transmit location. Ensure GPS is turned on.');
    }
  };

  const handleOpenMap = (lat: number, lng: number) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`).catch(() => {});
  };

  const handleUpdateBookingStatus = async (bookingId: number, status: 'confirmed' | 'rejected') => {
    try {
      const response = await axios.patch(`${API_URL}/trips/bookings/${bookingId}/status`, { status });
      if (response.data.success) {
        showAlertBanner(`✨ Request ${status === 'confirmed' ? 'approved' : 'declined'} successfully.`);
        fetchData();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      Alert.alert('Error', error.response?.data?.error || currentText.errorMsg);
    }
  };

  const handleCallDriver = (phoneNumber: string) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`).catch(() => Alert.alert('Phone', phoneNumber));
  };

  const handlePostTrip = async () => {
    if (!user) return;
    if (!origin.trim() || !destination.trim() || !availableSeats.trim() || !pricePerSeat.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const dateString = departureTime.trim().replace(' ', 'T');
      const formattedTime = !isNaN(Date.parse(dateString)) ? new Date(dateString).toISOString() : new Date().toISOString();

      const response = await axios.post(`${API_URL}/trips`, {
        driverId: user.id, 
        origin: origin.trim(), 
        destination: destination.trim(), 
        departureTime: formattedTime, 
        availableSeats: Number(availableSeats), 
        pricePerSeat: Number(pricePerSeat)
      });

      if (response.data.success) {
        showAlertBanner('🚀 Travel route successfully published live.');
        setOrigin(''); setDestination(''); setDepartureTime(''); setAvailableSeats(''); setPricePerSeat('');
        setActiveTab('feed'); fetchTrips();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      Alert.alert('Publish Error', error.response?.data?.error || currentText.errorMsg);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0F172A" barStyle="light-content" translucent={false} />
      
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>ጉዞ-ሼር <Text style={{color: '#10B981'}}>Guzo</Text></Text>
          <Text style={styles.headerSubtitle}>PREMIER ETHIOPIAN TRANSIT</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.langToggle} onPress={() => setLang(lang === 'en' ? 'am' : 'en')} activeOpacity={0.7}>
            <Text style={styles.langText}>{lang === 'en' ? 'አማርኛ' : 'English'}</Text>
          </TouchableOpacity>
          {user && (
            <TouchableOpacity style={styles.logoutBtn} onPress={() => { setUser(null); setAuthView('welcome'); }} activeOpacity={0.7}>
              <Text style={styles.logoutText}>{currentText.logoutBtn}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {bannerMessage && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{bannerMessage}</Text>
        </View>
      )}

      {/* Full Screen Scrollable Content Container */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {!user && authView === 'welcome' && (
          <View style={styles.welcomeWrapper}>
            <View style={styles.heroCard3D}>
              <View style={styles.heroGlowOverlay} />
              <View style={styles.heroBadgeRow}>
                <View style={styles.heroIconCircle}>
                  <Text style={styles.heroEmoji}>🚘⚡</Text>
                </View>
                <View style={styles.livePulseBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.livePulseText}>LIVE INTERCITY POOL</Text>
                </View>
              </View>

              <Text style={styles.authTitle}>{currentText.welcomeTitle}</Text>
              <Text style={styles.authSubtitle}>{currentText.welcomeSubtitle}</Text>

              <View style={styles.metricStrip3D}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricVal}>100%</Text>
                  <Text style={styles.metricLbl}>Verified IDs</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={styles.metricVal}>40-60%</Text>
                  <Text style={styles.metricLbl}>Fare Savings</Text>
                </View>
                <View style={styles.metricDivider} />
                <View style={styles.metricItem}>
                  <Text style={styles.metricVal}>GPS</Text>
                  <Text style={styles.metricLbl}>Live Radar</Text>
                </View>
              </View>
            </View>

            <View style={styles.welcomeButtonGroup}>
              <TouchableOpacity style={styles.glowPrimaryBtn} onPress={() => setAuthView('signup')} activeOpacity={0.85}>
                <Text style={styles.glowPrimaryBtnText}>⚡ {currentText.signUpNavBtn}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.glossSecondaryBtn} onPress={() => setAuthView('signin')} activeOpacity={0.85}>
                <Text style={styles.glossSecondaryBtnText}>{currentText.signInNavBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!user && authView === 'signin' && (
          <View style={styles.authContainer}>
            <TouchableOpacity onPress={() => setAuthView('welcome')} style={styles.backLink} activeOpacity={0.7}>
              <Text style={styles.backLinkText}>{currentText.backBtn}</Text>
            </TouchableOpacity>
            <Text style={styles.authTitle}>{currentText.signInTitle}</Text>
            <Text style={styles.authSubtitle}>{currentText.signInSubtitle}</Text>

            <Text style={styles.label}>{currentText.phoneLabel}</Text>
            <TextInput style={styles.input3D} placeholder="0911223344" placeholderTextColor="#94A3B8" keyboardType="phone-pad" value={phoneInput} onChangeText={setPhoneInput} />

            <TouchableOpacity style={styles.glowPrimaryBtn} onPress={handleSignIn} activeOpacity={0.8}>
              <Text style={styles.glowPrimaryBtnText}>{currentText.signInBtn}</Text>
            </TouchableOpacity>
          </View>
        )}

        {!user && authView === 'signup' && (
          <View style={styles.authContainer}>
            <TouchableOpacity onPress={() => setAuthView('welcome')} style={styles.backLink} activeOpacity={0.7}>
              <Text style={styles.backLinkText}>{currentText.backBtn}</Text>
            </TouchableOpacity>
            <Text style={styles.authTitle}>{currentText.signUpTitle}</Text>
            <Text style={styles.authSubtitle}>{currentText.signUpSubtitle}</Text>

            <Text style={styles.label}>{currentText.nameLabel}</Text>
            <TextInput style={styles.input3D} placeholder="Abebe Kebede" placeholderTextColor="#94A3B8" value={fullNameInput} onChangeText={setFullNameInput} />

            <Text style={styles.label}>{currentText.phoneLabel}</Text>
            <TextInput style={styles.input3D} placeholder="0911223344" placeholderTextColor="#94A3B8" keyboardType="phone-pad" value={phoneInput} onChangeText={setPhoneInput} />

            <Text style={styles.label}>{currentText.roleLabel}</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity style={[styles.roleCard3D, selectedRole === 'passenger' && styles.selectedRoleCard3D]} onPress={() => setSelectedRole('passenger')} activeOpacity={0.8}>
                <Text style={[styles.roleText, selectedRole === 'passenger' && styles.selectedRoleText3D]}>{currentText.passengerRole}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roleCard3D, selectedRole === 'driver' && styles.selectedRoleCard3D]} onPress={() => setSelectedRole('driver')} activeOpacity={0.8}>
                <Text style={[styles.roleText, selectedRole === 'driver' && styles.selectedRoleText3D]}>{currentText.driverRole}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.glowPrimaryBtn} onPress={handleSignUp} activeOpacity={0.8}>
              <Text style={styles.glowPrimaryBtnText}>{currentText.signUpBtn}</Text>
            </TouchableOpacity>
          </View>
        )}

        {user && (
          <View style={styles.dashboardBody}>
            <View style={styles.tabContainer3D}>
              <TouchableOpacity style={[styles.tab3D, activeTab === 'feed' && styles.activeTab3D]} onPress={() => setActiveTab('feed')} activeOpacity={0.8}>
                <Text style={[styles.tabText3D, activeTab === 'feed' && styles.activeTabText3D]}>{currentText.findRide}</Text>
              </TouchableOpacity>

              {user.role === 'passenger' && (
                <TouchableOpacity style={[styles.tab3D, activeTab === 'bookings' && styles.activeTab3D]} onPress={() => setActiveTab('bookings')} activeOpacity={0.8}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                    <Text style={[styles.tabText3D, activeTab === 'bookings' && styles.activeTabText3D]}>{currentText.myBookings}</Text>
                    {unreadCount > 0 && <View style={styles.notificationDot} />}
                  </View>
                </TouchableOpacity>
              )}

              {user.role === 'driver' && (
                <>
                  <TouchableOpacity style={[styles.tab3D, activeTab === 'post' && styles.activeTab3D]} onPress={() => setActiveTab('post')} activeOpacity={0.8}>
                    <Text style={[styles.tabText3D, activeTab === 'post' && styles.activeTabText3D]}>{currentText.postTrip}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tab3D, activeTab === 'requests' && styles.activeTab3D]} onPress={() => setActiveTab('requests')} activeOpacity={0.8}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                      <Text style={[styles.tabText3D, activeTab === 'requests' && styles.activeTabText3D]}>{currentText.driverRequests}</Text>
                      {unreadCount > 0 && <View style={styles.notificationDot} />}
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {activeTab === 'feed' && (
              <View style={styles.content}>
                <View style={styles.searchCard3D}>
                  <Text style={styles.searchHeader}>{currentText.liveFeedTitle}</Text>
                  <TextInput style={styles.input3D} placeholder={currentText.searchOriginPlaceholder} placeholderTextColor="#94A3B8" value={inputOrigin} onChangeText={setInputOrigin} />
                  <TextInput style={styles.input3D} placeholder={currentText.searchDestPlaceholder} placeholderTextColor="#94A3B8" value={inputDestination} onChangeText={setInputDestination} />
                  <View style={styles.searchButtonRow}>
                    <TouchableOpacity style={styles.glowPrimaryBtnSmall} onPress={() => fetchTrips(inputOrigin.trim(), inputDestination.trim())} activeOpacity={0.8}>
                      <Text style={styles.glowPrimaryBtnTextSmall}>{currentText.searchBtn}</Text>
                    </TouchableOpacity>
                    {(inputOrigin !== '' || inputDestination !== '') ? (
                      <TouchableOpacity style={styles.glossSecondaryBtnSmall} onPress={() => { setInputOrigin(''); setInputDestination(''); fetchTrips('', ''); }} activeOpacity={0.8}>
                        <Text style={styles.glossSecondaryBtnTextSmall}>{currentText.clearBtn}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>

                {trips.length === 0 ? (
                  <Text style={styles.emptyText}>{currentText.noTrips}</Text>
                ) : (
                  trips.map((item) => {
                    const currentSeats = selectedSeatsMap[item.id] || 1;
                    return (
                      <View key={item.id.toString()} style={styles.tripCard3D}>
                        <View style={styles.routeRow}>
                          <Text style={styles.routeText}>{item.origin} <Text style={{color: '#10B981'}}>➔</Text> {item.destination}</Text>
                          <Text style={styles.priceBadge}>{item.pricePerSeat} ETB</Text>
                        </View>
                        <Text style={styles.detailText}>🕒 {new Date(item.departureTime).toLocaleString()}</Text>
                        <Text style={styles.detailText}>💺 {currentText.seatsLabel}: <Text style={{fontWeight: '900', color: '#10B981'}}>{item.availableSeats}</Text></Text>
                        <Text style={styles.driverText}>👤 {currentText.driverLabel}: {item.driver?.fullName || 'Driver'} | 📞 {item.driver?.phoneNumber || 'N/A'}</Text>
                        
                        {user.role === 'passenger' && (
                          <View style={styles.seatSelectorContainer}>
                            <Text style={styles.seatSelectorLabel}>Seats to Request:</Text>
                            <View style={styles.seatCounterRow}>
                              <TouchableOpacity 
                                style={styles.seatControlBtn} 
                                onPress={() => {
                                  if (currentSeats > 1) {
                                    setSelectedSeatsMap({ ...selectedSeatsMap, [item.id]: currentSeats - 1 });
                                  }
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.seatControlText}>-</Text>
                              </TouchableOpacity>

                              <Text style={styles.seatCountText}>{currentSeats}</Text>

                              <TouchableOpacity 
                                style={styles.seatControlBtn} 
                                onPress={() => {
                                  if (currentSeats < item.availableSeats) {
                                    setSelectedSeatsMap({ ...selectedSeatsMap, [item.id]: currentSeats + 1 });
                                  }
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.seatControlText}>+</Text>
                              </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.actionBtnGlowDark} onPress={() => handleBookSeat(item.id, currentSeats)} activeOpacity={0.8}>
                              <Text style={styles.actionBtnTextDark}>{currentText.bookSeatBtn} ({currentSeats})</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {user.role === 'driver' && user.id === item.driverId && (
                          <TouchableOpacity style={styles.actionBtnCrimson} onPress={() => handleCompleteTrip(item.id)} activeOpacity={0.8}>
                            <Text style={styles.actionBtnTextLight}>{currentText.completeTripBtn}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })
                )}
              </View>
            )}

            {activeTab === 'bookings' && user.role === 'passenger' && (
              <View style={styles.content}>
                <Text style={styles.formTitle}>My Bookings & Radar</Text>
                {bookings.length === 0 ? (
                  <Text style={styles.emptyText}>{currentText.noBookings}</Text>
                ) : (
                  bookings.map((item) => (
                    <View key={item.id.toString()} style={[styles.tripCard3D, item.status === 'confirmed' && { borderColor: '#10B981', backgroundColor: '#F0FDF4' }]}>
                      <Text style={styles.routeText}>Route: {item.trip?.origin || item.tripOrigin || 'Origin'} ➔ {item.trip?.destination || item.tripDestination || 'Destination'}</Text>
                      <Text style={styles.detailText}>💺 Seats Booked: <Text style={{fontWeight: '900', color: '#10B981'}}>{item.seatsBooked}</Text></Text>
                      <Text style={styles.detailText}>Status: <Text style={{fontWeight: '900', color: item.status === 'confirmed' ? '#10B981' : item.status === 'rejected' ? '#EF4444' : '#F59E0B'}}>
                        {item.status === 'confirmed' ? currentText.confirmedStatus : item.status === 'rejected' ? currentText.rejectedStatus : currentText.pendingStatus}
                      </Text></Text>

                      {item.pickupLat && item.pickupLng && (
                        <LiveMap latitude={item.pickupLat} longitude={item.pickupLng} title="Your Shared Pickup Point" />
                      )}

                      {item.status === 'confirmed' && (
                        <View style={styles.buttonActionGroup}>
                          <TouchableOpacity style={styles.actionBtnEmerald} onPress={() => handleCallDriver(item.trip?.driver?.phoneNumber || '')} activeOpacity={0.8}>
                            <Text style={styles.actionBtnTextLight}>{currentText.callDriverBtn}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionBtnIndigo} onPress={() => handleSendLocation(item.id)} activeOpacity={0.8}>
                            <Text style={styles.actionBtnTextLight}>{currentText.sendLocationBtn}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}

            {activeTab === 'requests' && user.role === 'driver' && (
              <View style={styles.content}>
                <Text style={styles.formTitle}>Incoming Passenger Radar</Text>
                {bookings.length === 0 ? (
                  <Text style={styles.emptyText}>{currentText.noBookings}</Text>
                ) : (
                  bookings.map((item) => (
                    <View key={item.id.toString()} style={styles.tripCard3D}>
                      <Text style={styles.routeText}>Route: {item.tripOrigin || 'Origin'} ➔ {item.tripDestination || 'Destination'}</Text>
                      <Text style={styles.detailText}>👤 Booker: {item.passenger?.fullName || 'Passenger'} | 📞 {item.passenger?.phoneNumber || 'N/A'}</Text>
                      <Text style={styles.detailText}>💺 Seats Requested: <Text style={{fontWeight: '900', color: '#10B981'}}>{item.seatsBooked}</Text></Text>
                      <Text style={styles.detailText}>Status: <Text style={{fontWeight: '900', color: item.status === 'confirmed' ? '#10B981' : '#EF4444'}}>{item.status?.toUpperCase()}</Text></Text>

                      {item.pickupLat && item.pickupLng && (
                        <>
                          <LiveMap latitude={item.pickupLat} longitude={item.pickupLng} title={`${item.passenger?.fullName || 'Passenger'}'s Location`} />
                          <TouchableOpacity style={styles.actionBtnAmber} onPress={() => handleOpenMap(item.pickupLat!, item.pickupLng!)} activeOpacity={0.8}>
                            <Text style={styles.actionBtnTextLight}>{currentText.viewMapBtn}</Text>
                          </TouchableOpacity>
                        </>
                      )}

                      {item.status === 'pending' && (
                        <View style={styles.buttonActionGroup}>
                          <TouchableOpacity style={styles.actionBtnEmerald} onPress={() => handleUpdateBookingStatus(item.id, 'confirmed')} activeOpacity={0.8}>
                            <Text style={styles.actionBtnTextLight}>{currentText.acceptBtn}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionBtnCrimson} onPress={() => handleUpdateBookingStatus(item.id, 'rejected')} activeOpacity={0.8}>
                            <Text style={styles.actionBtnTextLight}>{currentText.rejectBtn}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}

            {activeTab === 'post' && user.role === 'driver' && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>{currentText.publishTitle}</Text>
                
                <Text style={styles.label}>{currentText.originPlaceholder}</Text>
                <TextInput style={styles.input3D} placeholder="Megenagna, Addis Ababa" placeholderTextColor="#94A3B8" value={origin} onChangeText={setOrigin} />
                
                <Text style={styles.label}>{currentText.destPlaceholder}</Text>
                <TextInput style={styles.input3D} placeholder="Adama" placeholderTextColor="#94A3B8" value={destination} onChangeText={setDestination} />
                
                <Text style={styles.label}>{currentText.timeLabel}</Text>
                <TextInput style={styles.input3D} placeholder="2026-08-25 14:30" placeholderTextColor="#94A3B8" value={departureTime} onChangeText={setDepartureTime} />

                <Text style={styles.label}>{currentText.seatsPlaceholder}</Text>
                <TextInput style={styles.input3D} placeholder="3" placeholderTextColor="#94A3B8" keyboardType="numeric" value={availableSeats} onChangeText={setAvailableSeats} />

                <View style={styles.fareCalculatorBox}>
                  <Text style={styles.fareCalculatorHeader}>💡 Smart Fare Estimator</Text>
                  <Text style={styles.label}>Rate per KM (ETB)</Text>
                  <TextInput 
                    style={[styles.input3D, { marginBottom: 8 }]} 
                    placeholder="15" 
                    placeholderTextColor="#94A3B8" 
                    keyboardType="numeric" 
                    value={ratePerKm} 
                    onChangeText={setRatePerKm} 
                  />

                  {origin.trim() !== '' && destination.trim() !== '' && (
                    <View style={styles.farePreviewRow}>
                      <Text style={styles.farePreviewText}>
                        Est. Distance: <Text style={{fontWeight: '900', color: '#0F172A'}}>{estimateRouteDistance(origin, destination)} km</Text>
                      </Text>
                      <TouchableOpacity 
                        style={styles.autoFillBtn}
                        onPress={() => {
                          const suggested = calculateSuggestedFare(origin, destination, Number(ratePerKm || 15));
                          setPricePerSeat(suggested.toString());
                          showAlertBanner(`✨ Auto-calculated fare set to ${suggested} ETB!`);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.autoFillBtnText}>Auto-Fill Fare</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                
                <Text style={styles.label}>{currentText.pricePlaceholder}</Text>
                <TextInput style={styles.input3D} placeholder="350" placeholderTextColor="#94A3B8" keyboardType="numeric" value={pricePerSeat} onChangeText={setPricePerSeat} />

                <TouchableOpacity style={styles.glowPrimaryBtn} onPress={handlePostTrip} activeOpacity={0.8}>
                  <Text style={styles.glowPrimaryBtnText}>{currentText.publishBtn}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: { 
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0F172A',
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingTop: Platform.OS === 'android' ? 12 : 14
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 11, color: '#10B981', fontWeight: '900', marginTop: 2, letterSpacing: 1 },
  langToggle: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  langText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  logoutText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  banner: { 
    backgroundColor: '#ECFDF5', 
    padding: 12, 
    marginHorizontal: 14, 
    marginTop: 10, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#A7F3D0' 
  },
  bannerText: { color: '#065F46', fontWeight: '800', fontSize: 14, textAlign: 'center' },
  
  scrollContainer: { 
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 60,
    paddingHorizontal: 16,
    paddingTop: 12
  },
  welcomeWrapper: { width: '100%' },
  heroCard3D: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  heroGlowOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 6,
    backgroundColor: '#10B981',
    borderTopLeftRadius: 24, borderTopRightRadius: 24
  },
  heroBadgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heroIconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#A7F3D0' },
  heroEmoji: { fontSize: 24 },
  livePulseBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#86EFAC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 6 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  livePulseText: { fontSize: 11, fontWeight: '900', color: '#065F46', letterSpacing: 0.8 },
  authTitle: { fontSize: 24, fontWeight: '900', color: '#0F172A', marginBottom: 6, letterSpacing: -0.5 },
  authSubtitle: { fontSize: 14, color: '#64748B', lineHeight: 20, fontWeight: '600', marginBottom: 16 },
  metricStrip3D: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'space-around', alignItems: 'center' },
  metricItem: { alignItems: 'center' },
  metricVal: { fontSize: 16, fontWeight: '900', color: '#10B981' },
  metricLbl: { fontSize: 11, fontWeight: '800', color: '#64748B', marginTop: 2, textTransform: 'uppercase' },
  metricDivider: { width: 1, height: 28, backgroundColor: '#E2E8F0' },
  welcomeButtonGroup: { width: '100%', gap: 12, marginBottom: 24 },

  authContainer: { width: '100%', paddingVertical: 10 },
  backLink: { marginBottom: 12 },
  backLinkText: { fontSize: 14, fontWeight: '800', color: '#10B981' },
  label: { fontSize: 13, fontWeight: '900', color: '#334155', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 },
  input3D: { backgroundColor: '#FFFFFF', color: '#0F172A', padding: 14, borderRadius: 12, marginBottom: 14, fontSize: 16, borderWidth: 1, borderColor: '#CBD5E1', fontWeight: '700', width: '100%' },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20, width: '100%' },
  roleCard3D: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', backgroundColor: '#FFFFFF' },
  selectedRoleCard3D: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  roleText: { fontSize: 14, fontWeight: '800', color: '#64748B' },
  selectedRoleText3D: { color: '#10B981' },
  glowPrimaryBtn: { backgroundColor: '#10B981', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, alignItems: 'center', width: '100%', elevation: 6 },
  glowPrimaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  glossSecondaryBtn: { backgroundColor: '#FFFFFF', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: '#CBD5E1', elevation: 2 },
  glossSecondaryBtnText: { color: '#0F172A', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  glowPrimaryBtnSmall: { flex: 2, backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  glowPrimaryBtnTextSmall: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  glossSecondaryBtnSmall: { flex: 1, backgroundColor: '#F1F5F9', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  glossSecondaryBtnTextSmall: { color: '#0F172A', fontSize: 14, fontWeight: '800' },
  
  dashboardBody: { width: '100%' },
  tabContainer3D: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 6, marginBottom: 14, borderRadius: 14, width: '100%' },
  tab3D: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab3D: { backgroundColor: '#0F172A', elevation: 3 },
  tabText3D: { color: '#475569', fontWeight: '800', fontSize: 14 },
  activeTabText3D: { color: '#FFFFFF' },
  notificationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  content: { width: '100%' },
  searchCard3D: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0', width: '100%' },
  searchHeader: { fontSize: 14, fontWeight: '900', color: '#0F172A', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  searchButtonRow: { flexDirection: 'row', gap: 8, width: '100%' },
  
  tripCard3D: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 18, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderLeftWidth: 4, 
    borderLeftColor: '#10B981',
    width: '100%'
  },
  routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  routeText: { fontSize: 16, fontWeight: '900', color: '#0F172A', letterSpacing: -0.2 },
  priceBadge: { 
    fontSize: 14, fontWeight: '900', color: '#FFFFFF', 
    backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden'
  },
  detailText: { color: '#475569', fontSize: 14, marginBottom: 5, fontWeight: '700' },
  driverText: { color: '#10B981', fontSize: 14, marginTop: 6, fontWeight: '800' },
  
  seatSelectorContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  seatSelectorLabel: { fontSize: 13, fontWeight: '900', color: '#64748B', marginBottom: 8, textTransform: 'uppercase' },
  seatCounterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  seatControlBtn: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CBD5E1' },
  seatControlText: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  seatCountText: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  
  fareCalculatorBox: { backgroundColor: '#F8FAFC', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14, width: '100%' },
  fareCalculatorHeader: { fontSize: 14, fontWeight: '900', color: '#10B981', marginBottom: 10, textTransform: 'uppercase' },
  farePreviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  farePreviewText: { fontSize: 14, color: '#475569', fontWeight: '700' },
  autoFillBtn: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  autoFillBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },

  buttonActionGroup: { flexDirection: 'row', gap: 8, marginTop: 10, width: '100%' },
  actionBtnGlowDark: { backgroundColor: '#0F172A', marginTop: 10, paddingVertical: 12, borderRadius: 10, alignItems: 'center', width: '100%' },
  actionBtnTextDark: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  actionBtnEmerald: { flex: 1, backgroundColor: '#10B981', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  actionBtnIndigo: { flex: 1, backgroundColor: '#4F46E5', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  actionBtnCrimson: { flex: 1, backgroundColor: '#EF4444', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  actionBtnAmber: { backgroundColor: '#F59E0B', marginTop: 10, paddingVertical: 10, borderRadius: 8, alignItems: 'center', width: '100%' },
  actionBtnTextLight: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  emptyText: { color: '#94A3B8', textAlign: 'center', marginTop: 30, fontSize: 15, fontWeight: '800' },
  formContainer: { width: '100%' },
  formTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginBottom: 12 },
});