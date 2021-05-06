import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeUserSession(value) {
    try {
        await EncryptedStorage.setItem(
            "user_session",
            JSON.stringify(value)
        );
        // Congrats! You've just stored your first value!
    } catch (error) {
        console.log("store user error: ",error)
        // There was an error on the native side
    }
}

export async function retrieveUserSession() {
    try {   
        const session = await EncryptedStorage.getItem("user_session");
        return session;
    } catch (error) {
        // There was an error on the native side
    }
}

// Removing a value
export async function removeUserSession() {
    try {
        await EncryptedStorage.removeItem("user_session");
        // Congrats! You've just removed your first value!
    } catch (error) {
        // There was an error on the native side
    }
}

// Clearing all previously saved values
export async function clearStorage() {
    try {
        await EncryptedStorage.clear();
        // Congrats! You've just cleared the device storage!
    } catch (error) {
        // There was an error on the native side
    }
}