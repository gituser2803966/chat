// import React, {useContext, useReducer, useEffect} from 'react';
// import AuthReducer from '../reducer/authReducer';
// import auth from '@react-native-firebase/auth';
// import {storeUserSession} from '../utilis/storage';

// const AuthContext = React.createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({children}) {
//   const [state, dispatch] = useReducer(AuthReducer, {
//     isLoading: true,
//     isSignout: false,
//     userToken: null,
//   });

//   const authUser = React.useMemo(
//     () => ({
//       signUp: async data => {
//         try {
//           const {email, password} = data;
//           const response = await auth().createUserWithEmailAndPassword(
//             email,
//             password,
//           );
//           // await storeUserSession(response.user);
//           // dispatch({type: 'SIGN_IN', token: response.user});
//         } catch (error) {
//           console.log('error login ... ', error);
//         }
//       },
//       signIn: async data => {
//         try {
//           const {email, password} = data;
//           const response = await auth().signInWithEmailAndPassword(
//             email,
//             password,
//           );
//           // await storeUserSession(response.user);
//           dispatch({type: 'SIGN_IN', token: response.user});
//         } catch (error) {
//           console.log('error login ... ', error);
//         }
//       },
//       signOut: () => dispatch({type: 'SIGN_OUT'}),
//       signUp: async data => {
//         dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
//       },
//     }),
//     [],
//   );

//   function onAuthStateChanged(user) {
//     dispatch({type: 'SIGN_IN', token: user});
//     // if (initializing) setInitializing(false);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   const value = {authUser};

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
