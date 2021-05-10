import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useContacts} from '../contexts/ContactsProvider';
import {CreateRoomMetadata, AddMessageToRoomMessages, roomMessagesName} from '../FBDatabase';

export default function OpenChatScreen({navigation, route}) {
  const {recipient} = route.params;
  const [messages, setMessages] = useState([]);
  const {contacts} = useContacts();
  const currentUser = auth().currentUser;
  useEffect(() => {
    const idPair = IDPair(currentUser.uid, recipient.uid);
    const unsubcriber = firestore()
      .collection(roomMessagesName)
      .doc(idPair).collection('messages')
      .onSnapshot(
        snapshot => {
          snapshot.docChanges().forEach(change => {
            var loadMessagesFromFirebase = [];
            if (change.type === 'added') {
              var user = {};
              const contact = contacts.find(contact => {
                return contact.uid === change.doc.data().senderId;
              });
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
                text: change.doc.data().message,
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

  function CreateRoomChatWithMetadata() {
    const idPair = IDPair(currentUser.uid, recipient.uid);
    const roomMetadataProps = {
      roomId: idPair,
      createdByUserId: currentUser.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
      name: recipient.displayName,
      type: 'public',
    };
    return CreateRoomMetadata(roomMetadataProps);
  }

  function AddMessageToConversation(messageText) {
    // * room-messages/
    // * <room-id>
    //     * <message-id>
    //         * userId - The id of the user that sent the message.
    //         * name - The name of the user that sent the message.
    //         * message - The content of the message.
    //         * timestamp - The time at which the message was sent.
    var roomIdRef = IDPair(currentUser.uid, recipient.uid);

    const content = {
      roomId: roomIdRef,
      senderId: currentUser.uid,
      username: currentUser.displayName,
      message: messageText,
      timestamp: firestore.FieldValue.serverTimestamp(),
    };
    AddMessageToRoomMessages(content).then(()=>{
      const senderRef = firestore().collection('users').doc(currentUser.uid);
      const recipientRef = firestore().collection('users').doc(recipient.uid);
      senderRef.update({
        roomIds: firestore.FieldValue.arrayUnion(roomIdRef),
      });
      recipientRef.update({
        roomIds: firestore.FieldValue.arrayUnion(roomIdRef),
      });
    });
  }

  const onSend = useCallback((messages = []) => {
    const messageText = messages[0].text;
    CreateRoomChatWithMetadata();
    AddMessageToConversation(messageText);
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
    backgroundColor: '#ffffff',
  },
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
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
