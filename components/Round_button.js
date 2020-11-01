import React, { Component } from "react";
import {StyleSheet, View, Dimensions} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {FontAwesome5} from '@expo/vector-icons'; 
import {AppContext} from "../context/AppProvider";

class Round_button extends Component {

    render() {
        return (
            <>
            <AppContext.Consumer>    
            {({styles: {round_backgroundColor, icon_round_color}}) => (
                <View style = {this.styles.view}>
                    <TouchableOpacity
                        activeOpacity = {.5}
                        style = {this.styles.button(round_backgroundColor)}
                        onPress = {() => this.props.navigation.navigate("Create", {update_notes: this.props.update_notes})}>
                        <FontAwesome5 name = "plus" size={25} color = {icon_round_color} /*color: dodger blue*/  style = {{textAlign: "center"}}/>   
                    </TouchableOpacity>
                </View>
            )}
            </AppContext.Consumer>
            </>
        );
    }

    styles = StyleSheet.create({
        view: {
            position: "absolute",
            borderRadius:  Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
            marginLeft: Math.round(Dimensions.get("window").width) * 0.75,
            marginTop: Math.round(Dimensions.get("window").height) * 0.65,
            borderColor: "black",
            borderWidth: 1,
            flex: 1,
            backgroundColor: "white",
        },  
        button: round_backgroundColor => ({
            backgroundColor: round_backgroundColor,
            borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
            justifyContent: "center",
            alignContent: "center",
            width: Dimensions.get("window").width * 0.18,
            height: Dimensions.get("window").width * 0.18,
        })
    });
}

export default Round_button;