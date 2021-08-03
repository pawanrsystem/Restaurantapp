import React, { useState } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, Image, View, TextInput, SafeAreaView, RefreshControl } from 'react-native';
import APIKit from './api/APIKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import StarRating from 'react-native-star-rating';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from '@react-native-community/geolocation';

const RestaurantScreen = ({ route, navigation }) => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isRender, setRender] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loaderValue, setLoaderValue] = React.useState('Getting Location');
  const [restaurantValue, setInputValue] = useState('');

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
          message: "<h2>Use Location?</h2> \
            This app wants to change your device settings:<br/><br/>\
            Use GPS for location<br/><br/>",
          ok: "Yes",
          cancel: "No",
          style: {
            backgroundColor: 'white',
            positiveButtonTextColor: '#000000',
            negativeButtonTextColor: '#000000'
          },
          enableHighAccuracy: true,
          showDialog: true,
          openLocationServices: true,
          preventOutSideTouch: true,
          preventBackClick: true,
          providerListener: true
        }).then(function (success) {
          if (success.status == "enabled") {
            setLoader(true)
            setLoaderValue('Getting Location')
            Geolocation.getCurrentPosition(data => {
              const getData = async () => {
                try {
                  const value = await AsyncStorage.getItem('isLogin')
                  if (value !== null) {
                    // value previously stored
                    console.log('get value from preference ' + value)
                    setIsLogedIn(value)
                  } else {
                    console.log('get value from preference ' + value)
                    setIsLogedIn(false)
                  }
                } catch (e) {
                  setIsLogedIn(false)
                  console.log('current value is exception' + value)
                }
              }
              getData()
              setLoader(true)
              setLoaderValue('Getting Restaurant List')
              ApiCall()
            },
              err => alert(err.message),
              {
                enableHighAccuracy: false,
                timeout: 24000,
                maximumAge: 3000,
              })
          } 
        }).catch((error) => {
          console.log("== no click"+error.message);
        });
    });
    return unsubscribe
  }, [navigation]);
  const ApiCall = () => {
    APIKit.get('/users', {
      params: {
        page: 2
      }
    }).then(function (response) {
      // handle success
      //alert(JSON.stringify(response.data));
      setRestaurantData(response.data.data)
      setLoader(false)
      setRefreshing(false)

    })
      .catch(function (error) {
        setLoader(false)
        setRefreshing(false)
        alert(error.message);
      })
  }
 
  const onRefresh = () => {
    setRefreshing(true)
    //Clear old data of the list
    ApiCall()

  };
  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        visible={loader}
        textContent={loaderValue}
        textStyle={styles.spinnerTextStyle}
      />
      <View>
        {isLogedIn ? <Text style={{ textAlign: 'right', padding: 20 }}
          onPress={() => {
            navigation.navigate("profile", { key: '100' })
          }}
        >Profile</Text> : <Text style={{ textAlign: 'right', padding: 20 }}
          onPress={() => {
            navigation.navigate("Home", { key: '100' })
          }}>Login</Text>}
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 10, borderRadius: 10, alignItems: 'center' }}>
        <Image source={require("../assets/search.png")} />

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
          placeholder="Restaurant/Location"
          value={restaurantValue}
          onChangeText={text => {
            setInputValue(text)
          }}

        />
      </View>
      <FlatList
        keyExtractor={(restaurantData, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={restaurantData}
        extraData={isRender}
        renderItem={({ item }) => {
          return <TouchableOpacity style={{
            marginTop: 15, marginBottom: 15, shadowOffset: { width: 10, height: 10 },
            shadowColor: 'black',
            shadowOpacity: 3,
            elevation: 6,
            backgroundColor: '#FFFFFF',
            borderRadius: 10
          }} onPress={event => {
            //  alert(`${item.name}`);
            navigation.navigate("Restaurant detail", { key: item })
          }}>
            <View style={{ flexDirection: 'row' }} >
              <Image source={{ uri: item.avatar }} style={{ height: 126, width: 110, borderRadius: 10 }} />
              <View style={{ flex: 1, justifyContent: 'space-between', margin: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, color: '#0A0A0A' }}>{item.first_name}</Text>
                  <Text style={{ fontSize: 16, color: '#0A0A0A', alignItems: 'flex-end' }}>5 KM </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, color: '#0A0A0A' }}>{item.last_name}</Text>
                  <Image source={require("../assets/heart_filled.png")} style={{ height: 22, width: 22 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                  <View style={{ width: '50%', flexDirection: 'row' }}
                  ><StarRating
                      starSize={20}
                      halfStarEnabled={false}
                      disabled={false}
                      maxStars={5}
                      rating={item.id}
                      selectedStar={(rating) => {
                        var index = restaurantData.indexOf(item);
                        restaurantData[index].id = rating;
                        setRestaurantData(restaurantData)
                        setRender(!isRender)
                      }}
                      emptyStar={require("../assets/empty_star.png")}
                      fullStar={require("../assets/fill_star.png")}
                    />
                    <Text style={{ paddingStart: 5 }}>+91</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={require("../assets/comment_filled.png")} style={{ height: 22, width: 22 }} />
                    <Text style={{ paddingStart: 2 }}>5</Text>
                  </View>

                </View>

              </View>
            </View>
          </TouchableOpacity>
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#E5E5E5'
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});
export default RestaurantScreen