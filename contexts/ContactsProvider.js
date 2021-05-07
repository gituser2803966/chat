import React, {useContext, useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { usersCollName } from '../FBDatabase';

const ContactsContext = React.createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export function ContactsProvider({children}) {
  const [contacts, setContacts] = useState([]);
  const currentUser = auth().currentUser;

  function getContactList() {
    firestore()
      .collection(usersCollName)
      .get()
      .then(querySnapshot => {
          querySnapshot.forEach(doc=>{
            setContacts((prevContacts)=>{
              return [...prevContacts,doc.data()]
            })
          })
      })
      .catch(error => {
        console.log('Error getting contacts document:', error);
      });
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
