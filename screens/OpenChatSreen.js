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
import {useContacts} from '../contexts/ContactsProvider';

export default function OpenChatScreen({navigation, route}) {
  const {recipient} = route.params;
  const [messages, setMessages] = useState([]);
  const {contacts} = useContacts();
  // const { RNRandomBytes } = NativeModules;
  const currentUser = auth().currentUser;
  useEffect(() => {
    // setMessages([]);
    const idPair = IDPair(currentUser.uid, recipient.uid);
    const unsubcriber = firestore()
      .collection('room')
      .doc(idPair)
      .collection('messages')
      .orderBy('sent')
      .onSnapshot(
        snapshot => {
          snapshot.docChanges().forEach(change => {
            var loadMessagesFromFirebase = [];
            if (change.type === 'added') {
              var user = {};
              const contact = contacts.find(contact => {
                return contact.uid === change.doc.data().from;
              });
              // avatar = (contact.photoURL !== null && contact.photoURL) || null;
              if (contact) {
                user._id = contact.uid;
                user.name = (
                  contact.firstName +
                  ' ' +
                  contact.lastName
                ).substring(0, 1);
                if (contact.photoURL !== null) {
                  user.avatar = contact.photoURL;
                }
              } else {
                user._id = currentUser.uid;
                user.name = currentUser.displayName.substring(0, 1);
                if (currentUser.photoURL !== null) {
                  user.photoURL = currentUser.photoURL;
                }
              }
              loadMessagesFromFirebase.push({
                _id: Math.random() + Math.random() + 0.001,
                text: change.doc.data().text,
                createdAt: new Date(),
                user: user,
              });
            }
            setMessages(previousMessages => {
              return GiftedChat.append(
                previousMessages,
                loadMessagesFromFirebase,
              );
            });
            // if (change.type === "modified") {
            //     console.log("modified: ", change.doc.data());
            // }
            // if (change.type === "removed") {
            //     console.log("removed: ", change.doc.data());
            // }
          });
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
    // setMessages(previousMessages =>
    //   GiftedChat.append(previousMessages, messages),
    // );
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
        // renderUsernameOnMessage
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
