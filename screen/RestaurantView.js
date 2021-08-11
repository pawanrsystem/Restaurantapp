import React from 'react';
import {Text, TouchableOpacity, Image, View} from 'react-native';
import StarRating from 'react-native-star-rating';

const RestaurantView = ({item, navigation}) => {
  return (
    <TouchableOpacity
      style={{
        marginTop: 15,
        marginBottom: 15,
        shadowOffset: {width: 10, height: 10},
        shadowColor: 'black',
        shadowOpacity: 3,
        elevation: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
      }}
      onPress={event => {
        navigation.navigate('Restaurant detail', {key: item});
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: item.avatar}}
          style={{height: 126, width: 110, borderRadius: 10}}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            margin: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: '#0A0A0A'}}>
              {item.first_name}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#0A0A0A',
                alignItems: 'flex-end',
              }}>
              5 KM{' '}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: '#0A0A0A'}}>
              {item.last_name}
            </Text>
            <Image
              source={require('../assets/heart_filled.png')}
              style={{height: 22, width: 22}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '50%', flexDirection: 'row'}}>
              <StarRating
                starSize={20}
                halfStarEnabled={false}
                disabled={false}
                maxStars={5}
                rating={item.id}
                selectedStar={rating => {
                  var index = restaurantData.indexOf(item);
                  restaurantData[index].id = rating;
                  setRestaurantData(restaurantData);
                  setRender(!isRender);
                }}
                emptyStar={require('../assets/empty_star.png')}
                fullStar={require('../assets/fill_star.png')}
              />
              <Text style={{paddingStart: 5}}>+91</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../assets/comment_filled.png')}
                style={{height: 22, width: 22}}
              />
              <Text style={{paddingStart: 2}}>5</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default RestaurantView;
