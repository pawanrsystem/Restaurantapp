import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import {StatusBar} from 'expo-status-bar';

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      phonenumber: '',
    };
    this.input = React.createRef();
    InteractionManager.runAfterInteractions(() => {
      this.input.current.focus();
    });
  }
  loginClick() {
    if (!this.state.phonenumber.trim()) {
      alert('Please Enter phone Number');
      return;
    }
    if (
      this.state.phonenumber.length < 10 ||
      this.state.phonenumber.length > 10
    ) {
      alert('Please Enter valid phone number of length 10');
    } else {
      this.props.navigation.navigate('otp', {key: '100'});
    }
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
          <Text style={{fontSize: 20, color: '#2E3A59'}}>
            Where you find best reataurants.
          </Text>
          <View style={styles.forgot_button}>
            <Text style={{textAlign: 'center', color: '#807C7C', fontSize: 14}}>
              We will send a one time SMS message Carrie rate may apply
            </Text>
          </View>
          <View style={styles.inputView}>
            <TextInput
              ref={this.input}
              autoFocus={true}
              keyboardType="numeric"
              onChangeText={value =>
                this.setState({phonenumber: value.replace(/[^0-9]/g, '')})
              }
              style={styles.TextInput}
              placeholder="Pone number"
              value={this.state.phonenumber}
              placeholderTextColor="#2C2929"
            />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={this.loginClick.bind(this)}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#fff', fontSize: 20}}>Get your OTP </Text>
              <Image source={require('../assets/next.png')} />
            </View>
          </TouchableOpacity>
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
    borderColor: '#03DAC6',
  },

  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 1,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});
export default HomeScreen;
