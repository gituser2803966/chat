/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useReducer, useEffect,useState} from 'react';
 import SignIn from './components/SignIn';
 import Dashboard from './components/Dashboard';
 import {NavigationContainer} from '@react-navigation/native';
 import {enableScreens} from 'react-native-screens';
 import {createNativeStackNavigator} from 'react-native-screens/native-stack';
 import SignUp_Email from './components/SignUp_Email';
 import SignUp_Password from './components/SignUp_Password';
 import SignUp_DisplayName from './components/SignUp_DisplayName';
 import auth from '@react-native-firebase/auth';
 import {AddUserToDatabase} from './FBDatabase';
 
 enableScreens();
 const Stack = createNativeStackNavigator();
 export const AuthContext = React.createContext();
 
 const App = () => {
   const [acceptLogin, setAcceptLogin] = useState(false);
   const [state, dispatch] = React.useReducer(
     (prevState, action) => {
       switch (action.type) {
         case 'RESTORE_TOKEN':
           return {
             ...prevState,
             userToken: action.token,
             isLoading: false,
           };
         case 'SIGN_IN':
           return {
             ...prevState,
             isSignout: false,
             userToken: action.token,
           };
         case 'SIGN_OUT':
           return {
             ...prevState,
             isSignout: true,
             userToken: null,
           };
       }
     },
     {
       isLoading: true,
       isSignout: false,
       userToken: null,
     },
   );
 
   function onAuthStateChanged(user) {
     const bootstrapAsync = async () => {
       try {
           dispatch({type: 'SIGN_IN', token: user});
       } catch (e) {
         // Restoring token failed
       }
     };
     if (user) {
       bootstrapAsync();
     } else {
       dispatch({type: 'SIGN_OUT'});
     }
   }
 
   React.useEffect(() => {
     const unsubscriber = auth().onAuthStateChanged(onAuthStateChanged);
     return unsubscriber; // unsubscribe on unmount
   }, []);
 
   const authContext = React.useMemo(
     () => ({
       signIn: async data => {
         const {email, password} = data;
         await auth().signInWithEmailAndPassword(email, password);
       },
       signOut: async () => await auth().signOut(),
       signUp: async data => {
         try {
           const {email, password, firstName, lastName} = data;
           const response = await auth().createUserWithEmailAndPassword(
             email,
             password,
           );
           await response.user.updateProfile({
             displayName: firstName + ' ' + lastName,
           });
           const user = {
             uid: response.user.uid,
             firstName: firstName,
             lastName: lastName,
             displayName: firstName+' '+lastName,
             photoURL: null,
             roomIds:[],
             // example date
             createAt: new Date(),
             UpdateAt: null,
           };
           await AddUserToDatabase(user);
           // setAcceptLogin(true);
         } catch (error) {
           console.log('error when sign up ==>> ', error);
         }
       },
     }),
     [],
   );
   return (
     <AuthContext.Provider value={authContext}>
       <NavigationContainer>
         <Stack.Navigator>
           {state.userToken == null ? (
             <>
               <Stack.Screen name="signin" component={SignIn} 
                 options={{
                   headerShown:false,
                 }}
               />
               <Stack.Screen name="signUpEmail" component={SignUp_Email} 
                  options={{
                   title:'Đăng kí email'
                 }}
               />
               <Stack.Screen name="signUpPassword" component={SignUp_Password} 
                  options={{
                   title:'Đăng kí mật khẩu'
                 }}
               />
               <Stack.Screen
                 name="signUpDisplayName"
                 component={SignUp_DisplayName}
                 options={{
                   title:'tên hiển thị'
                 }}
               />
             </>
           ) : (
             <Stack.Screen
               name="dashboard"
               component={Dashboard}
               options={{headerShown: false}}
             />
           )}
         </Stack.Navigator>
       </NavigationContainer>
     </AuthContext.Provider>
   );
 };
 
 export default App;
 