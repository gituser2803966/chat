import React, {useState, useContext, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  roomsChatOneToOneCollName,
  userCollName,
  GetUserRooms,
  roomMessagesName,
  roomMetadataName,
} from '../FBDatabase';
import {useContacts} from '../contexts/ContactsProvider';

const RoomsContext = React.createContext();

export function useRooms() {
  return useContext(RoomsContext);
}

export function RoomProvider({children}) {
  const [rooms, setRooms] = useState([]);
  // get all room của user hiện tại
  async function GetAllRoomForThisUser() {
    const currentUser = auth().currentUser;
    const roomMetadataRef = firestore().collection(roomMetadataName);
    await firestore()
      .collection(userCollName)
      .doc(currentUser.uid)
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot.data().roomIds.length > 0) {
            const userRoomIds = documentSnapshot.data().roomIds;
            const roomVar = [];
            for (let index = 0; index < userRoomIds.length; index++) {
              roomMetadataRef
                .doc(userRoomIds[index])
                .get()
                .then(doc => {
                  roomVar.push(doc.data());
                  setRooms(roomVar);
                })
                .catch(error => console.log(error));
            }
          }
        },
        error => {
          console.log('xảy ra lỗi khi lấy dữ liệu từ user Doc: ', error);
        },
      );
  }

  const value = {
    rooms,
  };

  useEffect(() => {
    const unsubcriber = GetAllRoomForThisUser();
    return unsubcriber;
  }, []);

  return (
    <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>
  );
}
