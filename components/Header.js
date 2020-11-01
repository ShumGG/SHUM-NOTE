import React, {Component} from "react";
import {Dimensions, StatusBar, StyleSheet, Text, View} from "react-native";
import {MaterialIcons} from '@expo/vector-icons';
import {RFValue} from "react-native-responsive-fontsize";
import {FontAwesome5} from '@expo/vector-icons'; 
import {AppContext} from "../context/AppProvider";

class Header extends Component {

    open_drawer = () => {
        this.props.navigation.openDrawer();
    }

    search_note = () => {
        this.props.navigation.navigate("Search", {data: {screen: this.props.title}});
    }
    render() {
        return (
            <>
            <StatusBar barStyle = "dark-content" backgroundColor = "white"></StatusBar>
                <AppContext.Consumer>
                    {({styles: {backgroundColor, color, fontColor}}) => (
                        <View style = {this.styles.container(backgroundColor)}>
                            <View style = {this.styles.title_container}>
                                <Text><MaterialIcons onPress = {this.open_drawer} name = "menu" size = {RFValue(35, Math.round(Dimensions.get("window").height))} color = {color}/></Text>
                                <Text style = {this.styles.title(fontColor)}>{this.props.title}</Text>
                            </View>
                            <View style = {this.styles.search}><FontAwesome5 name = "search" size = {24} color = {color} onPress = {this.search_note}/></View>
                         </View>
                    )}
                </AppContext.Consumer>
            </>
        );
    }

    styles = StyleSheet.create({
        container: backgroundColor => ({
            backgroundColor: backgroundColor, 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderBottomWidth: 1,
        }),
        title_container: {
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 20,
        },
        title: fontColor => ({
            color: fontColor, 
            fontSize: RFValue(35, Math.round(Dimensions.get("window").height)), 
            fontFamily: "serif", 
            marginLeft: 8
        }),
        search: {
            paddingRight: 20, 
            flexDirection: "row", 
            alignItems: "center",
        }
    })
}

export default Header;


