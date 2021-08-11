import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  TextInput,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import APIKit from './api/APIKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import Geolocation from 'react-native-geolocation-service';
import RestaurantView from '../screen/RestaurantView';

const RestaurantScreen = ({navigation}) => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isRender, setRender] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loaderValue, setLoaderValue] = React.useState('Getting Location');
  const [restaurantInputValue, setInputValue] = useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
      console.log('input value is===' + restaurantInputValue);
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
          if (success.status == 'enabled') {
            setLoader(true);
            setLoaderValue('Getting Location');
            Geolocation.getCurrentPosition(
              data => {
                console.log('Location is----' + data.coords.latitude);

                setLoader(true);
                setLoaderValue('Getting Restaurant List');
                ApiCall();
              },
              err => {
                setLoader(false);
                alert(err.message);
              },
              {
                enableHighAccuracy: false,
                timeout: 24000,
                maximumAge: 3000,
              },
            );
          }
        })
        .catch(error => {
          console.log('== no click' + error.message);
        });
    });
    return unsubscribe;
  }, [navigation]);
  const ApiCall = () => {
    APIKit.get('/users', {
      params: {
        page: 2,
      },
    })
      .then(function (response) {
        // handle success
        //alert(JSON.stringify(response.data));
        setRestaurantData(response.data.data);
        setLoader(false);
        setRefreshing(false);
      })
      .catch(function (error) {
        setLoader(false);
        setRefreshing(false);
        alert(error.message);
      });
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('isLogin');
      if (value !== null) {
        // value previously stored
        console.log('get value from preference ' + value);
        setIsLogedIn(value);
      } else {
        console.log('get value from preference ' + value);
        setIsLogedIn(false);
      }
    } catch (e) {
      setIsLogedIn(false);
      console.log('current value is exception' + value);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    //Clear old data of the list
    ApiCall();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        visible={loader}
        textContent={loaderValue}
        textStyle={styles.spinnerTextStyle}
      />
      <View>
        {isLogedIn ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('profile', {key: '100'});
            }}>
            <Image
              source={require('../assets/dummy_user.png')}
              style={{
                padding: 20,
                width: 40,
                height: 40,
                margin: 10,
                borderRadius: 5,
              }}></Image>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              textAlign: 'right',
            }}
            onPress={() => {
              navigation.navigate('Home', {key: '100'});
            }}>
            <Image
              source={require('../assets/profile.png')}
              style={{
                padding: 20,
                width: 40,
                height: 40,
                margin: 10,
                borderRadius: 5,
              }}></Image>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          paddingHorizontal: 10,
          borderRadius: 10,
          alignItems: 'center',
        }}>
        <Image source={require('../assets/search.png')} />

        <TextInput
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          placeholder="Restaurant/Location"
          value={restaurantInputValue}
          onChangeText={text => {
            setInputValue(text);
          }}
          onSubmitEditing={event => {
            console.log('Searched text is---' + event.nativeEvent.text);
          }}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(restaurantData, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={restaurantData}
        extraData={isRender}
        renderItem={({item}) => (
          <RestaurantView
            item={item}
            navigation={navigation}
            onStarClick={(rating, item) => {
              console.log('clicked' + rating);
              console.log('clicked' + item.first_name);
              var index = restaurantData.indexOf(item);
              restaurantData[index].id = rating;
              setRestaurantData(restaurantData);
              setRender(!isRender);
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#E5E5E5',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
export default RestaurantScreen;
