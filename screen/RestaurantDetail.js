import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, SafeAreaView, TouchableOpacity, Button, FlatList } from 'react-native';
import { StatusBar } from "expo-status-bar";
import StarRating from 'react-native-star-rating';

const RestaurantDetail = ({ route, navigation }) => {
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState([
        {
            id: 1,
            title: 'take out trash'
        },
        {
            id: 2,
            title: 'wife to dinner'
        },
        {
            id: 3,
            title: 'make react app'
        }, {
            id: 4,
            title: 'make react app'
        }, {
            id: 5,
            title: 'make react app'
        }, {
            id: 6,
            title: 'make react app'
        }, {
            id: 7,
            title: 'make react app'
        },
    ]);

    const { key } = route.params;

    console.log('value is---' + key.first_name)

    return (
        <View style={styles.container}>
            <View style={{ width: '100%' }} >
                <TouchableOpacity style={{
                    width: 30,
                    borderRadius: 10,
                    marginStart: 20, marginTop: 40,
                    height: 30,
                    backgroundColor: "#FA5252",
                    alignItems: 'center',
                    justifyContent: 'center'
                }} onPress={() => {
                    navigation.pop(1);

                }}>
                    <Image source={require("../assets/back.png")} />
                </TouchableOpacity>


            </View>
            <ScrollView

                style={{
                    width: '100%', height: '100%'
                }}>
                <View style={{
                    width: '100%', alignItems: 'center',
                    justifyContent: 'center'
                }}>

                    <StatusBar style="auto" />
                    <Image source={{ uri: key.avatar }} style={{ height: 250, width: '80%', marginTop: 20 }} />
                    <Text style={{ paddingTop: 20, fontSize: 30 }}>{key.first_name}</Text>
                    <Text style={{ paddingTop: 10, fontSize: 10 }}>{key.last_name}</Text>
                    <Text style={{ paddingTop: 20 }}>{key.email}</Text>
                    <Text style={{ paddingTop: 30 }}>Share your experiance</Text>
                    { }
                    <View style={{ padding: 10 }}>
                        <StarRating
                            starSize={30}
                            halfStarEnabled={false}
                            disabled={false}
                            maxStars={5}
                            rating={rating}
                            selectedStar={(rating) => {
                                console.log('==pressed' + rating)
                                setRating(rating)
                            }}
                            emptyStar={require("../assets/empty_star.png")}
                            fullStar={require("../assets/fill_star.png")}

                        />
                    </View>
                    <View style={{
                        height: 115, width: '88%', borderColor: '#b4bbc6', opacity: 0.5, borderWidth: 1, borderRadius: 7, textAlignVertical: 'top', marginBottom: 30
                        , backgroundColor: 'white'
                    }}>
                        <TextInput
                            style={{ paddingBottom: 30 }}
                            multiline={true}
                            placeholder="Type your comment here"
                            onChangeText={text => {
                                console.log('count' + text.length)
                            }}
                        />
                        <TouchableOpacity style={{
                            position: 'absolute', bottom: 0,
                            right: 0,
                        }}>
                            <Text style={styles.button}>Send</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', paddingStart: 10, color: 'black' }}>
                        <Text style={{ paddingStart: 10 }}>Comments 130</Text>
                    </View>

                    <FlatList
                        style={{ width: '100%' }}
                        nestedScrollEnabled={true}
                        keyExtractor={(comments, index) => index.toString()}
                        data={comments}
                        renderItem={({ item }) => {
                            return <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={require("../assets/dummy_user.png")} style={{ height: 35, width: 35, borderRadius: 20 }} />
                                    <Text style={{ paddingStart: 10 }}>{item.title}</Text>
                                    <Text style={{ paddingStart: 10, color: '#B4BBC6' }}>24 min</Text>
                                </View>
                                <Text style={{ paddingTop: 5 }}>But don't you think the timing is off because many other apps have done this even earlier, causing people to switch apps?</Text>
                                <Image source={require("../assets/dummy_user.png")} style={{ height: 189, width: '100%', marginTop: 15 }} />

                            </View>

                        }}
                    />
                </View>
            </ScrollView>
        </View >

    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#E5E5E5',
        flexDirection: 'column'

    },
    button: {
        margin: 10,
        width: 48,
        borderRadius: 3,
        height: 25,
        alignItems: "center",
        textAlign: 'center',
        justifyContent: "center",
        backgroundColor: "#BDBDBD",
        color: 'white',
        fontSize: 16,
    },

});
export default RestaurantDetail;