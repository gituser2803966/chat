import React, {useContext, useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { userCollName } from '../FBDatabase';

const ContactsContext = React.createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export function ContactsProvider({children}) {
  const [contacts, setContacts] = useState([]);
  const currentUser = auth().currentUser;

  function getContactList() {
    return firestore()
      .collection(userCollName)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const contactsFromFireStore = [];
          if (change.type === 'added') {
            contactsFromFireStore.push(change.doc.data());
            setContacts(prevContacts=>{
              return [...prevContacts,change.doc.data()];
            });
          }
        })
      })
     
  }

  const value = {contacts};

  useEffect(() => {
    const unsubcriber = getContactList();
    return unsubcriber;
  }, []);

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}
