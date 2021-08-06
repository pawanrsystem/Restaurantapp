import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  InteractionManager,
  Alert,
  BackHandler,
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import auth from '@react-native-firebase/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import RNOtpVerify from 'react-native-otp-verify';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({route, navigation}) => {
  const [phonenumber, setphonenumber] = useState('');
  const [text, setText] = useState(
    'We will send a one time SMS message. Carrier rates may apply.',
  );
  const [loader, setLoader] = useState(false);
  const [otp, setotp] = useState('');
  const [isOptVisible, setisOptVisible] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const storeData = async value => {
    try {
      console.log('saved value to preference ' + value);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('isLogin', jsonValue);
      navigation.pop(1);
    } catch (e) {
      console.log('error is---' + e);
      // saving error
    }
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      RNOtpVerify.getHash().then(console.log).catch(console.log);
      RNOtpVerify.getOtp()
        .then(p => RNOtpVerify.addListener(otpHandler))
        .catch(p => console.log(p));

      auth().onAuthStateChanged(user => {
        if (user) {
          console.log('onAuthStateChanged =' + user.phoneNumber);
        } else {
          console.log('onAuthStateChanged = Not authenticated');
        }
      });
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    });

    return unsubscribe;
  }, [navigation]);

  const handleBackButton = () => {
    console.log('handleBackButton' + isOptVisible);
    if (isOptVisible) {
      console.log('handleBackButton 1');
      setisOptVisible(false);
      setText('We will send a one time SMS message. Carrier rates may apply.');
    } else {
      console.log('handleBackButton 1');
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      navigation.pop(1);
    }
    return true;
  };
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
        console.log('Otp Value is---' + otp);
        const codeConfirmation = await confirm.confirm(otp);
        console.log('Confirmation uuid' + codeConfirmation.user.uid);
        if (codeConfirmation.user.uid.length > 0) {
          const idToken = await auth().currentUser.getIdToken(true);
          console.log('Token is---' + idToken);
          storeData(true);
        }
      } catch (error) {
        alert(error);
      }
    } else {
      Alert('Enter Valid Otp.');
    }
  };

  const signInWithPhoneNumber = async phoneNumber => {
    console.log('Phone number is---' + phoneNumber);
    setLoader(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      if (confirmation.verificationId.length > 0) {
        setLoader(false);
        setisOptVisible(true);
        setText('Submit the 4 digit code you got on your provided number.');
        setConfirm(confirmation);
      } else {
        alert('confirmation.verificationId.length less than 0');
        setLoader(false);
        setisOptVisible(false);
      }
    } catch (err) {
      setisOptVisible(false);
      setLoader(false);
      alert(err);
      console.log('Error----' + JSON.stringify(err));
      console.log('error is===' + err);
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
      signInWithPhoneNumber('+91 ' + phonenumber);
    }
  };

  return (
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
            // navigation.pop(1);
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
              <Image source={require('../assets/next.png')} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={verifyOtpClick}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#fff', fontSize: 20}}>
                Verify your OTP{' '}
              </Text>
              <Image source={require('../assets/next.png')} />
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
  );
};
// class HomeScreen extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       phonenumber: '',
//       loader: false,
//       otp: '',
//       isOptVisible: false,
//     };

//     this.input = React.createRef();
//     InteractionManager.runAfterInteractions(() => {
//       this.input.current.focus();
//     });
//     RNOtpVerify.getHash().then(console.log).catch(console.log);
//     RNOtpVerify.getOtp()
//       .then(p => RNOtpVerify.addListener(this.otpHandler))
//       .catch(p => console.log(p));
//   }

//   otpHandler = message => {
//     const val = /(\d{4})/g.exec(message)[1];
//     this.setState({otp: val});
//     RNOtpVerify.removeListener();
//     // Keyboard.dismiss();
//   };

//   storeData = async value => {
//     try {
//       console.log('saved value to preference ' + value);
//       const jsonValue = JSON.stringify(value);
//       await AsyncStorage.setItem('isLogin', jsonValue);
//     } catch (e) {
//       // saving error
//     }
//   };
//   _otpClick() {
//     if (!this.state.otp.trim()) {
//       alert('Please Enter otp');
//       return;
//     }
//     if (this.state.otp.length < 4) {
//       alert('Please Enter valid otp of length 10');
//     } else {
//       this.storeData(true);
//       //this.props.navigation.navigate("detail", { key: '100' })
//       //this.props.navigation.goBack();
//       this.props.navigation.pop(2);
//     }
//   }
//   componentWillUnmount() {
//     RNOtpVerify.removeListener();
//   }
//   signInWithPhoneNumber = async phoneNumber => {
//     console.log('Phone number is---' + phoneNumber);
//     this.setState({loader: true});
//     try {
//       const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//       this.setState({loader: false});
//       if (confirmation.verificationId.length > 0) {
//         this.setState({isOptVisible: true});
//         // this.props.navigation.navigate('otp', {
//         //   key: confirmation,
//         // });
//         try {
//           const codeConfirmation = await confirmation.confirm('234567');
//           console.log(
//             'Out put value ---' + codeConfirmation.additionalUserInfo.isNewUser,
//           );
//           console.log('Out put value ---' + codeConfirmation.user.uid);
//           console.log(
//             'Out put value ---' +
//               codeConfirmation.additionalUserInfo.providerId,
//           );
//           console.log(
//             'Out put value ---' + codeConfirmation.additionalUserInfo.username,
//           );
//         } catch (error) {
//           alert(error);
//         }
//       } else {
//         this.setState({isOptVisible: false});
//       }
//     } catch (err) {
//       this.setState({isOptVisible: false});

//       this.setState({loader: false});
//       alert(err);

//       console.log('error is===' + err);
//     }
//   };
//   loginClick() {
//     if (!this.state.phonenumber.trim()) {
//       alert('Please Enter phone Number');
//       return;
//     }
//     if (
//       this.state.phonenumber.length < 10 ||
//       this.state.phonenumber.length > 10
//     ) {
//       alert('Please Enter valid phone number of length 10');
//     } else {
//       //this.props.navigation.navigate('otp', { key: '100' });
//       this.signInWithPhoneNumber('+91 ' + this.state.phonenumber);
//     }
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <Spinner
//           visible={this.state.loader}
//           textContent="Loading..."
//           textStyle={styles.spinnerTextStyle}
//         />
//         <View style={{width: '100%'}}>
//           <TouchableOpacity
//             style={{
//               width: 30,
//               borderRadius: 10,
//               marginStart: 20,
//               marginTop: 40,
//               height: 30,
//               backgroundColor: '#FA5252',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//             onPress={() => {
//               console.log('clicked');
//               this.props.navigation.pop(1);
//             }}>
//             <Image source={require('../assets/back.png')} />
//           </TouchableOpacity>
//         </View>
//         <View
//           style={{
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '100%',
//           }}>
//           <StatusBar style="auto" />
//           <Image
//             source={require('../assets/crokery.png')}
//             style={{height: 127, width: 128}}
//           />
//           <Text style={styles.title}>rate my Dine</Text>
//           <Text style={{fontSize: 20, color: '#2E3A59'}}>
//             Where you find best reataurants.
//           </Text>
//           <View style={styles.forgot_button}>
//             <Text style={{textAlign: 'center', color: '#807C7C', fontSize: 14}}>
//               We will send a one time SMS message Carrie rate may apply
//             </Text>
//           </View>
//           {this.state.isOptVisible ? (
//             <OTPInputView
//               style={{width: '70%', height: 50}}
//               pinCount={4}
//               code={this.state.otp} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
//               onCodeChanged={code => {
//                 this.setState({otp: code});
//               }}
//               autoFocusOnLoad
//               codeInputFieldStyle={styles.underlineStyleBase}
//               codeInputHighlightStyle={styles.underlineStyleHighLighted}
//               onCodeFilled={code => {
//                 console.log(`Code is ${code}, you are good to go!`);
//                 this.setState({otp: code});
//                 //this.props.navigation.navigate("detail", { key: '100' })
//               }}
//             />
//           ) : (
//             <View style={styles.inputView}>
//               <TextInput
//                 ref={this.input}
//                 autoFocus={true}
//                 keyboardType="numeric"
//                 onChangeText={value =>
//                   this.setState({phonenumber: value.replace(/[^0-9]/g, '')})
//                 }
//                 style={styles.TextInput}
//                 placeholder="Pone number"
//                 value={this.state.phonenumber}
//                 placeholderTextColor="#2C2929"
//               />
//             </View>
//           )}

//           <TouchableOpacity
//             style={styles.loginBtn}
//             onPress={this.loginClick.bind(this)}>
//             <View style={{flexDirection: 'row', alignItems: 'center'}}>
//               <Text style={{color: '#fff', fontSize: 20}}>Get your OTP </Text>
//               <Image source={require('../assets/next.png')} />
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }
// }
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
