import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import {AuthContext} from '../App';
export default function SignIn({navigation}) {
  const [animating, setAnimating] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signIn} = useContext(AuthContext);

  const handleSignin = () => {
    if (email === '' ) {
      return Alert.alert('vui lòng nhập vào tài khoản');
    }
    if (password === '') {
      return Alert.alert('vui lòng nhập vào mật khẩu');
    }
    setAnimating(true);
    signIn({email, password})
      .then()
      .catch(error => {
        console.log(error)
        setAnimating(false);
        if (error.code === 'auth/user-not-found') {
          return Alert.alert('không tìm thấy người dùng hiện tại');
        }
        if (error.code === 'auth/invalid-email') {
          return Alert.alert('email không đúng định dạng hoặc không chính xác');
        }
        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Sai mật khẩu');
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>TẤN</Text>
            <TextInput
              autoFocus
              placeholder="enter your email"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={value => setEmail(value)}
              // value={email}
            />
            <TextInput
              placeholder="enter your Password"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={value => setPassword(value)}
              // value={password}
              secureTextEntry={true}
            />

            <Pressable
              style={styles.loginButton}
              onPress={() => handleSignin()}>
              {animating ? (
                <ActivityIndicator
                  animating={animating}
                  size="small"
                  color="#ffffff"
                />
              ) : (
                <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
              )}
            </Pressable>
            <Pressable
              style={styles.signupButton}
              onPress={() => navigation.navigate('signUpEmail')}>
              <Text style={styles.signupText}>đăng kí ngay</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    marginTop: 150,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginFormView: {
    flex: 1,
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
  loginButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
  },
  signupButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  signupText: {
    fontSize: 14,
    color: '#3897f1',
  },
});
