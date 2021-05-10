import React, {useContext, useEffect} from 'react';
import {Image, View, Text, StyleSheet, Pressable} from 'react-native';
import {AuthContext} from '../App';
import MainTab from '../screens/MainTab';
import SettingModal from '../screens/SettingModal';
import OpenChatScreen from '../screens/OpenChatSreen';
import {enableScreens} from 'react-native-screens';
import auth from '@react-native-firebase/auth';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {ContactsProvider} from '../contexts/ContactsProvider';

enableScreens();
const Stack = createNativeStackNavigator();

export default function Dashboard({navigation}) {
  const {signOut} = useContext(AuthContext);
  const currentUser = auth().currentUser;
  var NameToDisplay =
    (currentUser.displayName && currentUser.displayName.substring(0, 1)) || '';
  // console.log(user)
  //signOut fun
  const handleSignOut = () => {
    signOut();
  };

  // open setting screen
  const handlePress = () => {
    navigation.navigate('setting');
  };

  const UserImageOnClick = () => {};

  // header center
  const ImageTitleMainTab = () => {
    return (
      <Pressable
        onPress={() => {
          handlePress();
        }}>
        <View style={styles.container}>
          {currentUser.photoURL ? (
            <Image
              style={styles.userImageInConversaations}
              source={{
                uri: currentUser.photoURL,
              }}
            />
          ) : (
            <Text>{NameToDisplay}</Text>
          )}
        </View>
      </Pressable>
    );
  };

  const ImageTitleOpenChat = () => {
    return (
      <Pressable
        onPress={() => {
          UserImageOnClick();
        }}>
        <View style={styles.container}>
          <Image
            style={styles.userImageOpenChat}
            source={{
              uri: 'https://picsum.photos/100/100',
            }}
          />
          {/* {user.photoURL ? (
            <Image
              style={styles.userImage}
              source={{
                uri: user.photoURL,
              }}
            />
          ) : (
            <Text></Text>
          )} */}
        </View>
      </Pressable>
    );
  };

  //header Left
  const HeaderLeftSettingScreen = () => {
    return (
      <View style={styles.headerLeft}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <Text>close</Text>
        </Pressable>
      </View>
    );
  };

  // header right
  const HeaderRightSettingScreen = () => {
    return (
      <View style={styles.headerLeft}>
        <Pressable
          onPress={() => {
            handleSignOut();
          }}>
          <Text style={{color: '#2196F3'}}>đăng xuất</Text>
        </Pressable>
      </View>
    );
  };

  // useEffect(()=>{
  //   const user = auth().currentUser;
  //   NameToDisplay = (user.displayName && user.displayName.substring(0,1)) || '';
  // },[])

  return (
    <ContactsProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={MainTab}
          options={{
            headerCenter: props => <ImageTitleMainTab {...props} />,
          }}
        />
        <Stack.Screen
          options={{
            headerLeft: props => <HeaderLeftSettingScreen {...props} />,
            title: '',
            headerRight: props => <HeaderRightSettingScreen {...props} />,
            // stackPresentation: "fullScreenModal",
          }}
          name="setting"
          component={SettingModal}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            // headerLeft: props => <HeaderLeftSettingScreen {...props} />,
            // title: 'User recieve image',
            // headerCenter: props => <ImageTitleOpenChat {...props} />
            // headerRight: props => <HeaderRightSettingScreen {...props} />,
            // stackPresentation: "fullScreenModal",
          }}
          name="openchat"
          component={OpenChatScreen}
        />
      </Stack.Navigator>
    </ContactsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9FC',
  },
  headerLeft: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9FC',
  },
  userImageInConversaations: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  userImageOpenChat: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});
