import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, Text } from 'react-native';
import { StatusBar } from "expo-status-bar";
import DateTimePicker from '@react-native-community/datetimepicker';

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            dob: 'Please select date',
            show: false,
            date: new Date(),
            mode: 'date'
        };

    }

    render() {
        const onChange = (event, selectedDate) => {
            const currentDate = selectedDate || date;
            console.log('current date is--' + currentDate)
            this.setState({ show: false, dob: "" + currentDate })

        };
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
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
                        this.props.navigation.pop(1);

                    }}>
                        <Image source={require("../assets/back.png")} />
                    </TouchableOpacity>


                </View>
                <ScrollView style={{
                    width: '100%', height: '100%'
                }}>
                    <View style={{
                        width: '100%', alignItems: 'center',
                        justifyContent: 'center'
                    }}>

                        <StatusBar style="auto" />
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate("camera")
                        }
                        }>
                            <Image source={require("../assets/dummy_user.png")} style={{ height: 196, width: 196, borderRadius: 20 }} />
                        </TouchableOpacity>
                        <Text style={{ padding: 30 }}> User name</Text>
                        <Text style={{ padding: 10 }}> Date of birth</Text>
                        <Text style={{ padding: 10 }} onPress={() => {
                            this.setState({ show: true })

                        }
                        }> {this.state.dob}</Text>

                    </View>
                    {this.state.show && (
                        <DateTimePicker

                            value={this.state.date}
                            mode={this.state.mode}
                            dateFormat='yyyy-MM-dd'
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                        />
                    )}
                </ScrollView>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#E5E5E5',
        flexDirection: 'column'

    }

});
export default Profile;