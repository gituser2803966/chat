import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {roomRefWithDoc} from '../database';
// import { NativeModules } from 'react-native'

export default function OpenChatScreen({navigation, route}) {
  const {recipient} = route.params;
  const [messages, setMessages] = useState([]);
  // const { RNRandomBytes } = NativeModules;
  const currentUser = auth().currentUser;
  useEffect(() => {
    // console.log(RNRandomBytes)
    // RNRandomBytes.randomBytes(32, (err, bytes) => {
    //   // bytes is a base64string
    //   console.log("bytes: ",bytes)
    //   if(error){
    //     console,log(error);
    //   }
    // })
    // setMessages([
    //   {
    //     _id: 1,
    //     text: 'Hello developer',
    //     createdAt: new Date(),
    //     user: {
    //       _id: 2,
    //       name: 'React Native',
    //       avatar: 'https://placeimg.com/140/140/any',
    //     },
    //   },
    // ])
    const idPair = IDPair(currentUser.uid, recipient.uid);
    const unsubcriber = firestore()
      .collection('room')
      .doc(idPair)
      .collection('messages')
      .onSnapshot(
        querySnapshot => {
          querySnapshot.forEach((doc,index) => {
            console.log(index)
            // const messagesObj = {
            //   _id: messageIdGenerator(),
            //   text: doc.text,
            //   createdAt: new Date(),
            //   user: {
            //     _id: doc.from,
            //     name: currentUser.displayName,
            //     avatar: currentUser.photoURL ? currentUser.photoURL : null,
            //   },
            // };
            // setMessages(messagesObj)
          });
          // setMessages(messagesObj)
        },
        error => {
          console.log('real time error: ', error);
        },
      );
    return unsubcriber;
  }, []);

  // generate PairId
  function IDPair(id1, id2) {
    return [id1, id2].sort().join('_');
  }

  function dmCollection(uid) {
    const idPair = IDPair(currentUser.uid, uid);
    return firestore().collection('room').doc(idPair).collection('messages');
  }

  function sendDM(toUid, messageText) {
    return dmCollection(toUid).add({
      from: currentUser.uid,
      to: toUid,
      text: messageText,
      sent: firestore.FieldValue.serverTimestamp(),
    });
  }

  const onSend = useCallback((messages = []) => {
    const messageText = messages[0].text;
    sendDM(recipient.uid, messageText);
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <View style={styles.leftNavBar}>
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <Text>Back</Text>
          </Pressable>
          <Pressable>
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {recipient.photoURL ? (
                <>
                  <Image
                    style={styles.navBarUserImage}
                    source={{
                      uri: recipient.photoURL,
                    }}
                  />
                  <Text
                    style={{marginLeft: 10, fontSize: 15, fontWeight: '500'}}>
                    {recipient.firstName + ' ' + recipient.lastName}
                  </Text>
                </>
              ) : (
                <Text style={{marginLeft: 10, fontSize: 15, fontWeight: '500'}}>
                  {recipient.firstName + ' ' + recipient.lastName}
                </Text>
              )}
            </View>
          </Pressable>
        </View>
        
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUser.uid,
          name: currentUser.displayName,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#fafafa',
  },
  leftNavBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBarUserImage: {
    width: 40,
    height: 40,
    marginLeft: 20,
    borderRadius: 50,
  },
});
