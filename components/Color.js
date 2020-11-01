import React, { Component } from "react";
import { StyleSheet, View, Dimensions, Text} from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'; 
import AsyncStorage from "@react-native-community/async-storage";
import { Feather } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { RFValue} from "react-native-responsive-fontsize";
import {AppContext} from "../context/AppProvider";

class Color extends Component {
    
    icons_config = {name: "square-full", size: RFValue(80, Math.round(Dimensions.get("window").height))};
    show_hide_ = false;
    default_color = "white";
    
    change_color = async (key) => {
        
        if (this.props.screen === "popup_menu") {
    
            this.change_note_color(key);
    
        }else {
    
            this.change_text_color(key);
    
        }
    }
    
    change_note_color = async(key) => {

        let new_array_index = 0;
        let index_to_find = 0;
        let notes_changed_color = 0;
        const new_array_notes = this.props.array_notes;
        
        const notes = this.props.selected_notes.map((note) => { //create a new array with the selected items
            note.color = key; //set all selected items color to selected color
            note.no_select = false;
            return {...note};
        });

        while(notes_changed_color < notes.length) { //while the number of selected items is minus than the notes array, keep lopping
            index_to_find = new_array_notes.findIndex(obj => obj.note_number === notes[new_array_index].note_number); //finding in the index in the original array
            if (index_to_find != 0 || index_to_find === 0) { 
                new_array_notes.splice(index_to_find, 1, notes[new_array_index]); 
                new_array_index++; //pass to the next position to validate
                notes_changed_color++;
            }
        }

        try {
            let data = JSON.parse(await AsyncStorage.getItem("data"));
            data.array_notes = new_array_notes;
            await AsyncStorage.setItem("data", JSON.stringify(data));
        }catch(error) {
            alert(error);
        }

        this.props.remove_color();
    
    }
    
    change_text_color = async(key) => {
        
        if (this.props.screen === "create_note") {
        
            this.props.update_color(key);
            
        }else {
            
            let new_array_index = 0;
            let index_to_find = 0;
            let text_changed_color = 0;
            const new_array_notes = this.props.array_notes;
        
            const note = this.props.note.map((note) => {
                note.text_color = key; 
                return {...note};
            });

            while(text_changed_color < note.length) { 
                index_to_find = new_array_notes.findIndex(obj => obj.note_number === note[new_array_index].note_number); 
                if (index_to_find != 0 || index_to_find === 0) { 
                    new_array_notes.splice(index_to_find, 1, note[new_array_index]);
                    text_changed_color++; 
                }
            }

            this.props.update_color(new_array_notes);
        }
    }

    render() { 
        return (
            <>
                {(this.props.screen === "popup_menu") ?
                    <AppContext.Consumer>
                        {({styles: {drawer_backgroundColor}}) => (
                            <View style = {this.styles.container(drawer_backgroundColor)}>
                                <View style = {this.styles.colors_container}>
                                    <FontAwesome5 onPress = {() => this.change_color("#70706F")} name = {this.icons_config.name} size = {this.icons_config.size} color = "black"/>
                                    <FontAwesome5  onPress = {() => this.change_color("#3535FD")}  name = {this.icons_config.name} size = {this.icons_config.size} color = "blue"/>
                                    <FontAwesome5  onPress = {() => this.change_color("#C9C9C9")} name = {this.icons_config.name} size = {this.icons_config.size} color = "gray"/>
                                </View>
                                <View style = {this.styles.colors_container}>
                                    <FontAwesome5  onPress = {() => this.change_color("#3FA63F")} name = {this.icons_config.name} size = {this.icons_config.size} color = "green"/>
                                    <FontAwesome5  onPress = {() => this.change_color("#FFC34B")} name = {this.icons_config.name} size = {this.icons_config.size} color = "orange"/>
                                    <FontAwesome5  onPress = {() => this.change_color("#7F387F")} name = {this.icons_config.name} size = {this.icons_config.size} color = "purple"/>
                                </View>
                                <View style = {this.styles.colors_container}>
                                    <FontAwesome5  onPress = {() => this.change_color("#4CDFDF")} name = {this.icons_config.name} size = {this.icons_config.size} color = "cyan"/>
                                    <FontAwesome5  onPress = {() => this.change_color("#CB82CB")} name = {this.icons_config.name} size = {this.icons_config.size} color = "violet"/>
                                    <Feather onPress = {() => this.change_color(this.default_color)} name = "x" size = {this.icons_config.size} color = "black"/>
                                </View>
                            </View>
                        )}
                    </AppContext.Consumer>
                :
                   <AppContext.Consumer>
                       {({styles: {backgroundColor}}) => (
                        <Text_color change_color = {this.change_color.bind(this)}></Text_color>
                       )}
                    </AppContext.Consumer>  
                }
            </>
        );
    }

    styles = StyleSheet.create({
        container: drawer_backgroundColor => ({
            position: "absolute", 
            flexDirection: "row",
            backgroundColor: drawer_backgroundColor,
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            marginTop: Dimensions.get("window").height * 0.25,
            borderColor: "black", 
            borderWidth: 1
        }), 
        colors_container: {
            padding: 5,
        }
    })
}

const color = [
    "black",
    "blue",
    "gray",
    "green",
    "orange",
    "purple",
    "cyan",
    "violet",
];

const Text_color = ({change_color}) => {
    
    return (
        <View style = {styles.container}>
            {color.map((color) => {
                return (
                    <View key = {color}>
                        <FontAwesome name = "circle" size = {RFValue(35, Math.round(Dimensions.get("window").height))} color = {color} onPress = {() => change_color(color)}/>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center", 
        flexWrap: "wrap", 
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        borderColor: "black",
        borderBottomWidth: 1,
    },
})

export default Color;