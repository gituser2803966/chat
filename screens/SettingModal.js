import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  Pressable,
  View,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {width} from '../utilis/contants';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import app from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import { userDoc } from '../database';

function SettingModal() {
  const currentUser = auth().currentUser;
  const nameToDisplay = (currentUser.displayName && currentUser.displayName.substring(0, 1)) || '...';
  const [imageSource, setImageSource] = useState();
  const [progress, setProgress] = useState(0);
  const [isShowProgressBar, setIsShowProgressBar] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  function showlaunchImageLibrary() {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      response => {
        console.log(response);
        if (response.didCancel) {
          // user canceled
          setImageSource('');
          return;
        }
        setImageSource(response.uri);
        uploadImageToFireBaseStorage(response);
      },
    );
  }

  function uploadImageToFireBaseStorage(file) {
    const storageRef = storage().ref();
    let progressBar = 0;
    // [START storage_upload_handle_error]
    // Create the file metadata
    var metadata = {
      contentType: 'image/jpeg',
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef
      .child('images/' + file.fileName)
      .putFile(file.uri, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      app.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progressPercent + '% done');
        setIsShowProgressBar(true);
        progressBar += Math.round(progressPercent) / 100;
        setProgress(progressBar);
        if (progressPercent == 100) {
          setProgress(1);
          setIsShowProgressBar(false);
          setProgress(0);
        }
        switch (snapshot.state) {
          case app.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case app.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      error => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
           await currentUser.updateProfile({
            photoURL: downloadURL,
          });
           userDoc("IKBEmpbhXNkGPB1kBHKP").update({
            photoURL:downloadURL
          }).then(()=>{
            console.log('update OKKK')
          }).catch(error=>{
            console.log('error update ==>> ',error)
          })
        });
      },
    );
    // [END storage_upload_handle_error]
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.info}>
        <Pressable style={styles.imageView} onPress={showlaunchImageLibrary}>
          {imageSource || currentUser.photoURL ? (
            <>
              <Image
                style={styles.userImage}
                source={{
                  uri: imageSource || currentUser.photoURL,
                }}
              />
              <View style={{  marginVertical:5, display: isShowProgressBar ? "flex" : "none" }}>
              <Progress.Bar
                animated={true}
                progress={progress}
                indeterminate={indeterminate}
                width={50}
              />
              </View>
            </>
          ) : (
            <View style={styles.nonImageView}>
              <Text>{nameToDisplay}</Text>
            </View>
          )}
        </Pressable>
        <View style={styles.userInfo}>
          <Text>{currentUser.displayName}</Text>
          <Text>{currentUser.email}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  imageView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nonImageView: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1DA1F2',
    borderRadius: 50,
  },
  userInfo: {
    paddingLeft: 20,
  },
});

export default SettingModal;
