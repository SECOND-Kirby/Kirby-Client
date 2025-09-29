// import { router } from 'expo-router';
// import React, { useEffect } from 'react';
// import { ActivityIndicator, View, StyleSheet } from 'react-native';
//
// // ⚠️ 실제 프로젝트의 로그인 상태 관리 훅으로 교체해야 합니다.
// // (예: AsyncStorage, Context API, Redux, Zustand 등을 통해 인증 상태 확인)
// const useAuthStatus = () => {
//     // 임시 더미 데이터: 실제 인증 로직이 완료될 때까지 로딩 중 상태를 시뮬레이션
//     const [isLoading, setIsLoading] = React.useState(true);
//     // 임시 더미 데이터: 실제 로그인 상태 (true: 로그인, false: 로그아웃)
//     const [isAuthenticated, setIsAuthenticated] = React.useState(false);
//
//     useEffect(() => {
//         // 🚨 여기에 실제 로그인 토큰 검증 로직이나 API 호출이 들어갑니다.
//         // 예를 들어: const token = await AsyncStorage.getItem('userToken');
//         setTimeout(() => {
//             // 검증 완료 후 상태 업데이트
//             setIsLoading(false);
//             // setIsAuthenticated(!!token);
//         }, 1000);
//     }, []);
//
//     return { isAuthenticated, isLoading };
// };
//
//
// export default function RootIndexRedirect() {
//     const { isAuthenticated, isLoading } = useAuthStatus();
//
//     useEffect(() => {
//         if (!isLoading) {
//             if (isAuthenticated) {
//                 // 1. 로그인 상태: 하단 탭 바가 있는 메인 화면 그룹으로 이동
//                 router.replace('/(tabs)');
//             } else {
//                 // 2. 로그아웃 상태: 하단 탭 바가 없는 인증 화면 그룹으로 이동
//                 // (auth) 그룹의 첫 화면인 (auth)/index.tsx (로그인)으로 연결됩니다.
//                 router.replace('/(auth)');
//             }
//         }
//     }, [isAuthenticated, isLoading]);
//
//     // 인증 상태를 확인하는 동안 로딩 화면을 표시합니다.
//     if (isLoading) {
//         return (
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#B2C549" />
//             </View>
//         );
//     }
//
//     // 리다이렉트 역할만 수행하므로 null을 반환합니다.
//     return null;
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     }
// });