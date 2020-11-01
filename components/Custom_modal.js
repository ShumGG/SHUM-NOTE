import React, {Component } from "react";
import {StyleSheet, Text, Modal, View, Dimensions} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

class Custom_modal extends Component {

    go_back = () => {
        
        setTimeout(() => {
            this.props.screen === "create_note" ?  this.props.navigation.navigate("Home") : this.props.show_modal();
        }, 1000);
    }

    render () {
        return (
            <>
                <Modal
                    animationType = "fade"
                    transparent = {true}
                    onShow = {this.go_back}>
                    <View style = {this.styles.modal}>
                        <Text style = {this.styles.text}>Saved</Text>
                    </View>
                </Modal>
            </>
        )
    }

    styles = StyleSheet.create({
        modal: {
            backgroundColor: "rgba(230, 234, 234, 0.7)", //gray rgba with opacity 0.4
            borderRadius: 5, 
            width: 100, 
            justifyContent: "center", 
            alignItems: "center",
            position: "absolute", 
            alignSelf: "center", 
            marginTop: Dimensions.get("window").height * 0.8
        },
        text: {
            fontSize: RFValue(20, Math.round(Dimensions.get("window").height)),
            color: "black"
        }
    });
}

export default Custom_modal;