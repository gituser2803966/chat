import firestore from '@react-native-firebase/firestore';
import React, { useState } from 'react';

export const roomsChatOneToOneCollName = 'roomsChatOneToOne';
export const userCollName = 'users';
export const roomMetadataName = 'room-metadata';
export const roomMessagesName = 'room-messages';

export function userDoc(docId){
    return firestore().collection(userCollName).doc(docId)
}

export function CreateRoomMetadata(roomMetadataProps){
    const { roomId } = roomMetadataProps;
    return firestore().collection(roomMetadataName).doc(roomId).set(roomMetadataProps)
}

export function CreateRoomMessages(roomIdRef){
    return firestore().collection(roomMessagesName).doc(roomIdRef).collection('messages');
}

export function AddMessageToRoomMessages(content){
    // * room-messages/
    // * <room-id>
    //     * <message-id>
    //         * userId - The id of the user that sent the message.
    //         * name - The name of the user that sent the message.
    //         * message - The content of the message.
    //         * timestamp - The time at which the message was sent.
    const { roomId } = content;
    return CreateRoomMessages(roomId).add(content);
}

export function GetUserRooms(roomId){
    return firestore().collection(roomMessagesName).doc(roomId).get();
}

export function userCollRef(){
    return firestore().collection(userCollName);
}

export function getUserRooms(userId){
    return firestore().collection(userCollName).doc(userId).get();
}

export async function AddUserToDatabase(user){
    // const { uid, firstName, lastName, displayName,roomIds, photoURL, createAt, UpdateAt } = user;
    const userRef = firestore().collection(userCollName);
    await userRef.doc(user.uid).set(user)
}

