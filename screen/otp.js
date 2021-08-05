import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNOtpVerify from 'react-native-otp-verify';
import auth from '@react-native-firebase/auth';

class otp extends React.Component {
  constructor() {
    super();
    this.state = {
      otp: '',
    };
    RNOtpVerify.getHash().then(console.log).catch(console.log);
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(this.otpHandler))
      .catch(p => console.log(p));
  }
  otpHandler = message => {
    const val = /(\d{4})/g.exec(message)[1];
    this.setState({otp: val});
    RNOtpVerify.removeListener();
    // Keyboard.dismiss();
  };
  storeData = async value => {
    try {
      console.log('saved value to preference ' + value);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('isLogin', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  _otpClick() {
    if (!this.state.otp.trim()) {
      alert('Please Enter otp');
      return;
    }
    if (this.state.otp.length < 4) {
      alert('Please Enter valid otp of length 10');
    } else {
      this.storeData(true);
      //this.props.navigation.navigate("detail", { key: '100' })
      //this.props.navigation.goBack();
      this.props.navigation.pop(2);
    }
  }

  componentWillUnmount() {
    RNOtpVerify.removeListener();
  }
  render() {
    return (
      <View style={styles.container}>
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
              console.log('clicked');
              this.props.navigation.pop(1);
            }}>
            <Image source={require('../assets/back.png')} />
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
            source={require('../assets/crokery.png')}
            style={{height: 127, width: 128}}
          />
          <Text style={styles.title}>rate my Dine</Text>
          <Text style={{fontSize: 20, color: '#2E3A59', fontSize: 20}}>
            Where you find best reataurants.
          </Text>
          <View style={styles.forgot_button}>
            <Text style={{textAlign: 'center', color: '#807C7C', fontSize: 14}}>
              Submit the 4 digit code you got on your provided number.
            </Text>
          </View>
          <OTPInputView
            style={{width: '70%', height: 50}}
            pinCount={4}
            code={this.state.otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={code => {
              this.setState({otp: code});
            }}
            autoFocusOnLoad
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
              this.setState({otp: code});
              //this.props.navigation.navigate("detail", { key: '100' })
            }}
          />
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this._otpClick.bind(this)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#fff', fontSize: 20}}>
                Verify your OTP{' '}
              </Text>
              <Image source={require('../assets/next.png')} />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              textAlign: 'center',
              textDecorationLine: 'underline',
              color: '#807C7C',
            }}>
            Don't recieve on OTP?Resend
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E5E5',
  },

  loginBtn: {
    width: '70%',
    borderRadius: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    backgroundColor: '#FA5252',
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
    alignItems: 'center',
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
export default otp;
