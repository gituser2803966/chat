import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
} from 'react-native';
import {width} from '../utilis/contants';

export default function SignUp_Password({navigation, route}) {
  const {email} = route.params;
  const [password, setPassword] = useState();

  const PressHandler = () =>{
    navigation.navigate('signUpDisplayName',{
        email,password
    })
  }

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <TextInput
              placeholder="enter your password"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={value => setPassword(value)}
              value={password}
            />
            <Pressable
              style={styles.Button}
              onPress={() => PressHandler()}>
              <Text style={styles.loginButtonText}>Tiếp theo</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginFormView: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  loginFormTextInput: {
    padding: 12,
    width: width - 10,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
  },
  Button: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    width: width - 10,
  },
  loginButtonText: {
    color: '#fff',
  },
  signupButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
