import React, { Component } from "react";
import {StyleSheet, Text, View, StatusBar, Dimensions} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {AppContext} from "../context/AppProvider";

class about extends Component {
    
    render() {
   
        return (
            <>
                <AppContext.Consumer>
                    {({styles: {fontColor, backgroundColor}}) => (
                        <View style = {this.styles.container(backgroundColor)}>
                         <Text style = {this.styles.text(fontColor)}>Shum Note</Text>
                         <Text style = {this.styles.text(fontColor)}>A very simple notebloc.</Text>
                        </View>    
                    )}
                </AppContext.Consumer>
            </>
        );
    }

    styles = StyleSheet.create({
        container: (backgroundColor) =>({
            flex: 1,
            justifyContent: "center",
            marginTop: - Math.round(Dimensions.get("window").height * 0.5) / 2,
            backgroundColor: backgroundColor,
        }),
        text: fontColor => ({
            fontSize: RFValue(25, Math.round(Dimensions.get("window").height)),
            fontFamily: "serif",
            textAlign: "center",
            color: fontColor,
        })
    })
}

export default about;
