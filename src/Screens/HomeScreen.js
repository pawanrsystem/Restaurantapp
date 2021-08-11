import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import auth from '@react-native-firebase/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import RNOtpVerify from 'react-native-otp-verify';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AndroidBackHandler} from 'react-navigation-backhandler';

const HomeScreen = ({navigation}) => {
  const [phonenumber, setphonenumber] = useState('');
  const valueInputRef = React.useRef(null);

  const [text, setText] = useState(
    'We will send a one time SMS message. Carrier rates may apply.',
  );
  const [loader, setLoader] = useState(false);
  const [otp, setotp] = useState('');
  const [isOptVisible, setisOptVisible] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const onBackButtonPressAndroid = () => {
    if (isOptVisible) {
      setisOptVisible(false);
      setText('We will send a one time SMS message. Carrier rates may apply.');
    } else {
      navigation.pop(1);
    }
    return true;
  };
  const storeData = async value => {
    try {
      console.log('saved value to preference ' + value);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('isLogin', jsonValue);
      navigation.pop(1);
    } catch (e) {
      console.log('error is---' + e);
    }
  };
  React.useEffect(() => {
    RNOtpVerify.getHash().then(console.log).catch(console.log);
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(otpHandler))
      .catch(p => console.log('Otp verifier Error--' + p));
    setTimeout(() => {
      if (valueInputRef.current) {
        valueInputRef.current.focus();
      }
    }, 40);
  }, [navigation]);

  const otpHandler = message => {
    if (message != null && message != 'Timeout Error.') {
      console.log('Message is----' + message);
      const otpValue = /(\d{4})/g.exec(message)[1];
      if (otpValue != null) {
        setotp(otpValue);
        RNOtpVerify.removeListener();
      }
    }
  };

  const verifyOtpClick = async () => {
    if (otp.length >= 6) {
      try {
        setLoader(true);
        console.log('Otp Value is---' + otp);
        const codeConfirmation = await confirm.confirm(otp);
        console.log('Confirmation uuid' + codeConfirmation.user.uid);
        if (codeConfirmation.user.uid.length > 0) {
          const idToken = await auth().currentUser.getIdToken(true);
          console.log('Token is---' + idToken);
          storeData(true);
        }
        setLoader(false);
      } catch (error) {
        setLoader(false);

        alert(error);
      }
    } else {
      Alert('Enter Valid Otp.');
    }
  };

  const signInWithPhoneNumber = async phoneNumber => {
    try {
      setLoader(true);
      const confirmResult = await auth().signInWithPhoneNumber(
        phoneNumber,
        true,
      );
      console.log(confirmResult);
      if (confirmResult) {
        setLoader(false);
        setisOptVisible(true);
        setText('Submit the 4 digit code you got on your provided number.');
        setConfirm(confirmResult);
      }
    } catch (error) {
      setLoader(false);
      alert(error);

      console.log(error);
    }
  };
  const loginClick = () => {
    if (!phonenumber.trim()) {
      alert('Please Enter phone Number');
      return;
    }
    if (phonenumber.length < 10 || phonenumber.length > 10) {
      alert('Please Enter valid phone number of length 10');
    } else {
      signInWithPhoneNumber('+91' + phonenumber);
    }
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <View style={styles.container}>
        <Spinner
          visible={loader}
          textContent="Loading..."
          textStyle={styles.spinnerTextStyle}
        />
        <View style={{width: '100%'}}>
          <TouchableOpacity
            style={{
              width: 30,
              borderRadius: 10,
              marginStart: 20,
              marginTop: 40,
              height: 30,
              backgroundColor: '#FA5252',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              if (isOptVisible) {
                setisOptVisible(false);
                setText(
                  'We will send a one time SMS message. Carrier rates may apply.',
                );
              } else {
                navigation.pop(1);
              }
            }}>
            <Image source={require('../../assets/back.png')} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <StatusBar style="auto" />
          <Image
            source={require('../../assets/crokery.png')}
            style={{height: 127, width: 128}}
          />
          <Text style={styles.title}>rate my Dine</Text>
          <Text style={{fontSize: 20, color: '#2E3A59'}}>
            Where you find best reataurants.
          </Text>
          <View style={styles.forgot_button}>
            <Text style={{textAlign: 'center', color: '#807C7C', fontSize: 14}}>
              {text}{' '}
            </Text>
          </View>
          {isOptVisible ? (
            <OTPInputView
              style={{width: '70%', height: 50}}
              pinCount={6}
              code={otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              onCodeChanged={code => {
                setotp(code);
              }}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={code => {
                console.log(`Code is ${code}, you are good to go!`);
                setotp(code);
                //verifyOtpClick(otp);
                //this.props.navigation.navigate("detail", { key: '100' })
              }}
            />
          ) : (
            <View style={styles.inputView}>
              <TextInput
                ref={valueInputRef}
                autoFocus={true}
                keyboardType="numeric"
                onChangeText={value => {
                  setphonenumber(value.replace(/[^0-9]/g, ''));
                }}
                style={styles.TextInput}
                placeholder="Pone number"
                value={phonenumber}
                placeholderTextColor="#2C2929"
              />
            </View>
          )}
          {!isOptVisible ? (
            <TouchableOpacity style={styles.loginBtn} onPress={loginClick}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#fff', fontSize: 20}}>Get your OTP </Text>
                <Image source={require('../../assets/next.png')} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginBtn} onPress={verifyOtpClick}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#fff', fontSize: 20}}>
                  Verify your OTP{' '}
                </Text>
                <Image source={require('../../assets/next.png')} />
              </View>
            </TouchableOpacity>
          )}
          {isOptVisible ? (
            <Text
              style={{
                textAlign: 'center',
                textDecorationLine: 'underline',
                color: '#807C7C',
              }}>
              Don't recieve on OTP?Resend
            </Text>
          ) : null}
        </View>
      </View>
    </AndroidBackHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  image: {
    marginBottom: 40,
  },

  inputView: {
    backgroundColor: '#F4EEF0',
    borderRadius: 20,
    width: '70%',
    height: 45,
    marginBottom: 20,
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  forgot_button: {
    width: '70%',
    marginTop: 80,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 56,
    color: '#FA5252',
  },

  loginBtn: {
    width: '70%',
    borderRadius: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#FA5252',
  },

  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: 'white',
    color: 'black',
  },
  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: 8,
    color: 'black',
  },
  underlineStyleHighLighted: {
    borderColor: 'white',
    color: 'black',
  },
});
export default HomeScreen;
