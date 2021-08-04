import React from 'react';
import {Button, View, Text, state, ActivityIndicator} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from './api/APIKit';
class LoginScreen extends React.Component {
  storeData = async value => {
    try {
      console.log('saved value to preference ' + value);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('data', jsonValue);
      console.log('saved value to preference ' + value);
    } catch (e) {
      // saving error
    }
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('data');
      if (value !== null) {
        // value previously stored
        console.log('get value from preference ' + value);
      }
    } catch (e) {
      console.log('current value is exception' + value);
      // error reading value
    }
  };

  getDataUsingSimpleGetCall = () => {
    APIKit.get('/users?page=2')
      .then(function (response) {
        // handle success
        alert(JSON.stringify(response.data));

        console.log(response.data.data[0].avatar);
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      });
  };

  constructor() {
    super();
    this.state = {
      latitude: 0,
      longitude: 0,
      isLoading: false,
    };
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        '<h2>Use Location?</h2> \
        This app wants to change your device settings:<br/><br/>\
        Use GPS for location<br/><br/>',
      ok: 'Yes',
      cancel: 'No',
      style: {
        backgroundColor: 'white',
        positiveButtonTextColor: '#000000',
        negativeButtonTextColor: '#000000',
      },
      enableHighAccuracy: true,
      showDialog: true,
      openLocationServices: true,
      preventOutSideTouch: true,
      preventBackClick: true,
      providerListener: true,
    })
      .then(function (success) {
        console.log(success);
        if (success.status == 'enabled') {
        } else {
          alert('LOL');
        }
      })
      .catch(error => {
        console.log('== no click' + error.message);
      });
  }

  _onPressButton() {
    this.setState({latitude: 0, longitude: 0, isLoading: true});
    Geolocation.getCurrentPosition(
      data => {
        this.setState({
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          isLoading: false,
        });
      },
      err => alert(err.message),
      {
        enableHighAccuracy: false,
        timeout: 24000,
        maximumAge: 3000,
      },
    );
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <StatusBar style="auto" />
        <Text>Login Screen</Text>
        <Button
          title="Go to Home screen"
          onPress={() => {
            this.props.navigation.navigate('detail');
          }}
        />
        <Button onPress={this._onPressButton.bind(this)} title="Get Location" />
        <Button
          onPress={() => this.storeData(Math.floor(Math.random() * 100) + 1)}
          title="Set data"
        />
        <Button onPress={() => this.getData()} title="Get data" />
        <Text>Latitude is {this.state.latitude}</Text>
        <Text>Longitude is {this.state.longitude}</Text>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          animating={this.state.isLoading}
        />
        {true ? <Text>View is visible</Text> : null}
        <Button
          onPress={() => this.getDataUsingSimpleGetCall()}
          title="get api"
        />
      </View>
    );
  }
}

export default LoginScreen;
