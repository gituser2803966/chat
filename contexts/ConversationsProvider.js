import React, {useState, useContext, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {roomsChatOneToOneCollName,userCollName, GetUserRooms, roomMessagesName} from '../FBDatabase';
const ConversationsContext = React.createContext();

const currentUser = auth().currentUser;

export function useConverstions() {
  return useContext(ConversationsContext);
}

export function ConversationProvider({children}) {
  const [conversations, setConversations] = useState([]);

  function CreateConversations(){
    setConversations(prevConversations=>{
      return [...prevConversations,{messages:[],users,conversationName}]
    })
  }

  // get all room của user hiện tại
  function GetAllConversation() {
    const roomMessagesRef = firestore().collection(roomMessagesName);
    const roomIds =  firestore().collection(userCollName).doc(currentUser.uid).
    onSnapshot({includeMetadataChanges:true},
    (doc)=>{
      const roomIds = doc.data().roomIds;
      for (let index = 0; index < roomIds.length; index++) {
        roomMessagesRef
        .doc(roomIds[index])
        .collection('messages').orderBy('timestamp')
        .onSnapshot(snapshot=>{
          snapshot.docChanges().forEach(change=>{
            if(change.type === 'added'){
              console.log('change.doc.data*** :',change.doc.data())
            }
          })
        })
        // .then(querySnapshot => {
        //   querySnapshot.forEach(docSnapshot => {
        //     // console.log(docSnapshot.data());
        //     setConversations((prevConversations)=>{
        //       return [...prevConversations,docSnapshot.data()]
        //     })
        //   });
         
        // })
      }
    })  
  }

  const value = {
    conversations,
  };

  useEffect(() => {
    const unsubcriber = GetAllConversation();
    return unsubcriber;
  }, []);

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}
