import React, { Component } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, View } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { FlatList, Switch, TouchableOpacity } from "react-native-gesture-handler";
import {RFValue} from "react-native-responsive-fontsize";   
import {AppContext} from "../context/AppProvider";

class Drawer_style extends Component {
    
    state = {
        dark_mode: false,
    }
    
    icon_size = RFValue(30, Math.round(Dimensions.get("window").height));

    render() {
        

        let icon_config = [
            {
                name: "Home", 
                screen: "home", 
                color: this.props.activeItemKey === "home" ? this.props.activeTintColor : this.props.inactiveTintColor, 
                icon: <Entypo name = "home" size = {this.icon_size}/>, 
                key: "home"
            },
            {
                name: "Archive", 
                screen: "archived_notes",  
                color: this.props.activeItemKey === "archived_notes" ? this.props.activeTintColor : this.props.inactiveTintColor, 
                icon: <MaterialIcons name = "archive" size = {this.icon_size}/>, 
                key: "archive"},
            {
                name: "About", 
                screen: "about",  
                color: this.props.activeItemKey === "about" ? this.props.activeTintColor : this.props.inactiveTintColor, 
                icon: <FontAwesome5 name = "exclamation-circle" size = {this.icon_size}/>,
                key: "about"},
        ];

        return (
            <AppContext.Consumer>
                {({state: {dark}, actions: {dark_mode}, styles: {drawer_backgroundColor, color, drawer_icon_backgroundColor}}) => (
                    <View style = {this.styles.container(drawer_backgroundColor)}> 
                        <FlatList
                            data = {icon_config}
                            renderItem = {({item}) => (
                                <Drawer
                                    navigation = {this.props.navigation}
                                    screen = {item.screen}
                                    icon = {item.icon}
                                    name = {item.name}
                                    text_color = {item.color}
                                    dark = {dark}
                                    dark_text_color = {color}
                                    dark_icon_backgroundColor = {drawer_icon_backgroundColor}
                                    >
                                </Drawer>
                            )}>
                        </FlatList>
                        <View style = {this.styles.switch}>
                            <Text style = {this.styles.dark_mode}>Dark Mode</Text>
                            <Switch 
                                style = {{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], margin: 5}}
                                onValueChange = {() => dark_mode()} 
                                value = {dark} 
                                thumbColor = {"#1E90FF"} 
                                trackColor = {{false: "#CBCBCB"/*gray*/, true: "#497DB2"/*blue*/}}>
                            </Switch>
                        </View>
                    </View>
                )}
            </AppContext.Consumer>
       );
    }   

    styles = StyleSheet.create({
        container: drawer_backgroundColor => ({
            flex: 1,
            backgroundColor: drawer_backgroundColor,
        }),
        switch: {
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "space-between",
            borderTopWidth: 1,
            flex: 50,
        },
        dark_mode: {
            justifyContent: "flex-start",
            margin: 10,
            color: "black",
            fontSize: RFValue(25, Math.round(Dimensions.get("window").height)),
            fontFamily: "serif",
            paddingLeft: 5
        },  
    })
}

const Drawer = ({navigation, screen, icon, name, text_color, dark, dark_text_color, dark_icon_backgroundColor}) => {
    return (
        <TouchableOpacity
            onPress = {() => navigation.navigate(`${screen}`)}
            style = {styles.container_icon}>
            <View style = {styles.container_icon(text_color, dark, dark_icon_backgroundColor)}>
                <Text style = {styles.icon(text_color, dark, dark_text_color)}>{icon}</Text>
                <Text style = {styles.name(text_color, dark, dark_text_color)}>{name}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
    },
    container_icon: (text_color, dark, dark_icon_backgroundColor) => ({
        flexDirection: "row",
        backgroundColor: (dark) ? (text_color != "black") ? dark_icon_backgroundColor : null : (text_color != "black") ? dark_icon_backgroundColor : null, 
        width: Dimensions.get("window").width
    }),
    icon: (text_color, dark, dark_text_color) => ({
        margin: 10,
        color: (dark) ? (text_color != "black") ? dark_text_color : text_color : text_color,
    }),  
    name: (text_color, dark, dark_text_color) => ({
        fontSize: RFValue(25, Math.round(Dimensions.get("window").height)),
        margin: 10,
        color: (dark) ? (text_color != "black") ? dark_text_color : text_color : text_color,
        fontFamily: "serif",
    }),
})

export default Drawer_style;