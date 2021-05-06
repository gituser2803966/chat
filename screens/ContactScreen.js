import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import {useContacts} from '../contexts/ContactsProvider';
import auth from '@react-native-firebase/auth';

export default function ContactScreen({navigation}) {
  const {contacts} = useContacts();
  const currentUser = auth().currentUser;

  function OpenChat(contact){
    navigation.navigate("openchat",{
      recipient:contact
    })
  }

  const filterContacts = contacts.filter(c=>c.uid !== currentUser.uid)

  return (
    <View style={styles.container}>
      <View style={{
          display:"flex",
          flexDirection:'column',
      }}>
      {filterContacts.map((contact, index) => {
          const nameToDisplay = contact.firstName.substring(0,1);
        return (
          <Pressable
          key={index}
            onPress={()=>OpenChat(contact)}
          >
          <View
            style={styles.contact}
          >
          
            {contact.photoURL ? (
              <Image
                style={{
                    width:50,
                    height:50,
                    borderRadius:50,
                    marginRight:5,
                }}
                source={{
                  uri: contact.photoURL,
                }}
              />
            ) : (
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: '#1DA1F2',
                  borderRadius:50,
                  alignItems:"center",
                  justifyContent:'center',
                  marginRight:5,
                }}>
                <Text>{nameToDisplay}</Text>
              </View>
            )}
            <Text 
            >{contact.firstName+" "+contact.lastName}</Text>
           
          </View>
          </Pressable>
        );
      })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
  },
  contact:{
      display:"flex",
      flexDirection:"row",
      alignItems:"center",
      padding:5,
      backgroundColor:"#fafafa",
      borderBottomWidth:0.5,
      borderBottomColor:"#EBF0F9",
  }
});
