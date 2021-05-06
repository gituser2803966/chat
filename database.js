import firestore from '@react-native-firebase/firestore';

export function userDoc(docId){
    return firestore().collection('Users').doc(docId)
}

export function userColle(){
    return firestore().collection('Users');
}

export function roomRefWithDoc(collectionName,docId){
    return firestore().collection(collectionName).doc(docId);
}

export async function AddUserToDatabase(user){
    const { uid, firstName, lastName, photoURL, createAt, UpdateAt } = user;
    const userRef = firestore().collection('Users');
    await userRef.add({
        uid,firstName,lastName,photoURL,createAt,UpdateAt
    })
}

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

