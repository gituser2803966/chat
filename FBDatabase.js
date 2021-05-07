import firestore from '@react-native-firebase/firestore';

export const roomsChatOneToOneCollName = 'roomsChatOneToOne';
export const usersCollName = 'users';

export function userDoc(docId){
    return firestore().collection(usersCollName).doc(docId)
}

export function userCollRef(){
    return firestore().collection(usersCollName);
}

export function getUserRooms(userId){
    return firestore().collection(usersCollName).doc(userId).get();
}

export function roomRefWithDoc(collectionName,docId){
    return firestore().collection(collectionName).doc(docId);
}

export async function AddUserToDatabase(user){
    // const { uid, firstName, lastName, displayName,roomIds, photoURL, createAt, UpdateAt } = user;
    const userRef = firestore().collection(usersCollName);
    await userRef.doc(user.uid).set(user)
}

// get all rooms

// export function GetAllRooms(){
//     return 
// }


// export function GetUserList(){
//     var docRef = db.collection("Users").doc();
//     docRef.get().then((doc) => {
//         if (doc.exists) {
//             console.log("Document data:", doc.data());
//         } else {
//             console.log("No such document!");
//         }
//     }).catch((error) => {
//         console.log("Error getting document:", error);
//     });
// }

