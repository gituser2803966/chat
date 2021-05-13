import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import {useRooms, formattedRooms} from '../contexts/RoomsProvider';
import {useContacts} from '../contexts/ContactsProvider';
import auth from '@react-native-firebase/auth';

export default function ConversationScreen({navigation}) {
  const {rooms} = useRooms();
  const {contacts} = useContacts();
  const currentUser = auth().currentUser;

  const renderItem = ({item}) => {
    var roomName;

    if (
      item.createdByUserId === currentUser.uid ||
      item.recipients.length > 2
    ) {
      roomName = item.name;
    } else {
      item.recipients.forEach(recipient => {
        if (recipient === currentUser.uid) {
          const contact = contacts.find(c => {
            return c.uid === item.createdByUserId;
          });
           roomName = (contact && contact.displayName) || '';
        }
      });
    }

    return (
      <Pressable
        key={item.roomId}
        style={styles.conversationContent}
        onPress={() => {
          // navigation.navigate('openchat');
        }}>
        <View style={styles.conversationLeftContent}>
          <Image
            style={styles.image}
            source={{uri: 'https://picsum.photos/100/100'}}
          />
          <View style={{marginLeft: 10}}>
            <Text>{roomName}</Text>
            <Text>Last message</Text>
          </View>
        </View>
        <Text>time</Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Pressable style={styles.search}>
          <TextInput style={styles.textInput} placeholder="liên hê, nhóm" />
        </Pressable>
      </View>
      {rooms.length > 0 ? (
        <View style={styles.conversationContainer}>
          <FlatList
            data={rooms}
            renderItem={renderItem}
            keyExtractor={item => item.roomId}
          />
        </View>
      ) : (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text></Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  searchContainer: {
    height: 40,
    paddingHorizontal: 5,
  },
  search: {
    flex: 0.8,
    // paddingLeft: 5,
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  filter: {
    flex: 0.2,
  },
  textInput: {
    marginLeft: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  conversationContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#fafafa',
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EBF0F9',
  },
  conversationLeftContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
