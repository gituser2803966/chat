import React, {useContext, useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
// import { GetUserList } from '../database';

const ContactsContext = React.createContext();

export function useContacts() {
  return useContext(ContactsContext);
}

export function ContactsProvider({children}) {
  const [contacts, setContacts] = useState([]);
  const currentUser = auth().currentUser;

  function getContactList() {
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        // querySnapshot.forEach(doc => {
        //   setContacts((prevContacts)=>{
        //     const contactFilter = prevContacts.filter(c=>c.uid !== currentUser.uid)
        //     console.log("contactFilter: ",contactFilter);
        //     return [...contactFilter];
        //   });
          // doc.data() is never undefined for query doc snapshots
          // setContacts((prevContacts)=>{
          //   const contactFilter =  prevContacts.filter(contact=>contact.uid !== currentUser.uid);
          //   console.log("contactFilter: ",contactFilter)
          //   return [...contactFilter];
          // });
          querySnapshot.forEach(doc=>{
            // setContacts((prevContacts)=>{
            //     return [...prevContacts.filter(c=>c.uid != currentUser.uid),doc.data()]
            // })
            setContacts((prevContacts)=>{
              return [...prevContacts,doc.data()]
            })
          })
          
        // });
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
