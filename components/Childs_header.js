import React, {Component} from "react";
import {Dimensions, StatusBar, Text, View} from "react-native";
import {Ionicons} from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import {RFValue} from "react-native-responsive-fontsize";
import {AppContext} from "../context/AppProvider";

class Header extends Component {

    run_function = () =>{
        (this.props.title === "Create Note") ? this.props.navigation.getParam("save_data")() : this.props.navigation.getParam("save_changes")();
    }

    goback = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <>
            <StatusBar barStyle = "dark-content" backgroundColor = "white"></StatusBar>
                <AppContext.Consumer>
                    {({styles: {backgroundColor,color,  childs_header_fontColor, icon_check}}) => (
                        <View style = {this.styles.container(backgroundColor)}>
                            <View style = {this.styles.title_container}>
                                <Text><MaterialIcons onPress = {this.goback} name = "keyboard-backspace" size = {RFValue(35, Math.round(Dimensions.get("window").height))} color = {color}/></Text>
                                <Text style = {this.styles.title(childs_header_fontColor)}>{this.props.title}</Text>
                            </View>
                            {this.props.title != "Search Note" ? 
                                <View style = {this.styles.search}>
                                    <Ionicons name = "md-checkbox-outline" size = {RFValue(35, Math.round(Dimensions.get("window").height))} color = {icon_check} onPress = {this.run_function} />
                                </View>
                            : null}
                        </View>
                    )}
                </AppContext.Consumer>
            </>
        );
    }

    
    styles = {
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
        search: {
            paddingRight: 20, 
            flexDirection: "row", 
            alignItems: "center",
        },
        title: childs_header_fontColor => ({
            color: childs_header_fontColor /*color: dodger blue*/,
            fontSize: RFValue(35, Math.round(Dimensions.get("window").height)), 
            fontFamily: "serif", 
            marginLeft: 8
        }),
    }
}

export default Header;
