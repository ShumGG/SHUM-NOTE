import React, { Component } from "react";
import { StyleSheet, View, Text, Share, Dimensions} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import {MaterialIcons} from '@expo/vector-icons'; 
import Color from "../components/Color";
import {fetch_notes} from "../helpers/General_functions";
import {RFValue} from "react-native-responsive-fontsize";
import {AppContext} from "../context/AppProvider";

class Popup_menu extends Component {
 
    state = {
        show_hide_color: false,
        selected_notes_length: "",
    }
    
    icons_config = {size: RFValue(30, Dimensions.get("window").height), color: "black", color_no_edit: "gray"}; 
    
    option_icon = {
        archive: <MaterialIcons name = "archive" size = {this.icons_config.size} color = {this.icons_config.color}/>,
        unarchive: <MaterialIcons name = "unarchive" size = {this.icons_config.size} color = {this.icons_config.color}/>,
        allow_edit: <MaterialIcons name = "edit" size={this.icons_config.size}  color = {this.icons_config.color}/>,
        no_allow_edit: <MaterialIcons name = "edit" size={this.icons_config.size}  color = {this.icons_config.color_no_edit}/>,
        alloW_share: <MaterialIcons name = "share" size={this.icons_config.size}  color = {this.icons_config.color}/>,
        no_allow_share: <MaterialIcons name = "share" size={this.icons_config.size}  color = {this.icons_config.color_no_edit}/>
    }
    
    options_array = [
        {option: "", option_icon: "", key: "0"}, 
        {option: "Delete", option_icon: <MaterialIcons name = "delete" size = {this.icons_config.size} color = {this.icons_config.color}/>, key: "1"}, 
        {option: "Edit", option_icon: "", key: "2"}, 
        {option: "Share", option_icon: "", key: "3"}, 
        {option: "Color", option_icon: <MaterialIcons name = "color-lens" size={this.icons_config.size}  color = {this.icons_config.color}/>, key: "4"}
    ];

    static getDerivedStateFromProps(nextProps) {
        return {
            selected_notes_length: nextProps.selected_notes.length
        };
    }

    select_option(option) {
        
        const selected_note = this.props.selected_notes[0];
            
        switch(option) {
            case "0": //archive notes
                (this.props.screen != "home") ? this.unarchive() : this.archive(); 
                break;
            case "1": //delete notes
                this.delete_note();
                break;
            case "2": //edit notes
                (this.state.selected_notes_length > 1) ? () => {} : this.props.navigation.navigate("Edit", {data: {"selected_note": selected_note}});
                break;
            case "3": //share notes
                (this.state.selected_notes_length > 1) ? () => {} : this.share();
                break;
            case "4": //change color
                this.show_hide_color(); //set color to note
                break;
        }
    }

    archive = async() => {
        
        let new_array_index = 0;
        let index_to_find = 0;
        let notes_archived = 0;
        const new_array_notes = this.props.array_notes; //original array of notes
        const notes = this.props.selected_notes //array of the selected notes to archive

        const data = await fetch_notes();
        
        if (!data.archived_notes) { 
            
            const archived_notes = [];
            
            while(notes_archived < notes.length) { 
                index_to_find = new_array_notes.findIndex(obj => obj.note_number === notes[new_array_index].note_number); 
                if (index_to_find != 0 || index_to_find === 0) { 
                    new_array_notes[index_to_find].no_select = false;
                    archived_notes.push(new_array_notes[index_to_find]);
                    new_array_notes.splice(index_to_find, 1); 
                    notes_archived++;
                }
                new_array_index++;
            }
         
            try {
                data.archived_notes = archived_notes;  
                data.array_notes = new_array_notes;
                await AsyncStorage.setItem("data", JSON.stringify(data));
            }catch(error) {
                alert(error);
            }
                
            this.props.remove_color();
        }else {
            
            const archived_notes = data.archived_notes;
            
            while(notes_archived < notes.length) { 
                index_to_find = new_array_notes.findIndex(obj => obj.note_number === notes[new_array_index].note_number); 
                if (index_to_find != 0 || index_to_find === 0) { 
                    new_array_notes[index_to_find].no_select = false;
                    archived_notes.push(new_array_notes[index_to_find]);
                    new_array_notes.splice(index_to_find, 1); 
                    notes_archived++;
                }
                new_array_index++;
            }
         
            try {
                data.archived_notes = archived_notes;  
                data.array_notes = new_array_notes;
                await AsyncStorage.setItem("data", JSON.stringify(data));
            }catch(error) {
                alert(error);
            }
       
            this.props.remove_color();
        }
        
    }

    unarchive = async() => {
        
        let new_array_index = 0;
        let index_to_find = 0;
        let notes_unarchived = 0;
        const new_array_notes = this.props.array_notes; //array of archived notes
        const notes = this.props.selected_notes //array of selected notes from archived notes
        
        const data = await fetch_notes();
        let unarchive_array_notes = data.array_notes; //array_notes from home

        while(notes_unarchived < notes.length) { 
            index_to_find = new_array_notes.findIndex(obj => obj.note_number === notes[new_array_index].note_number); 
            if (index_to_find != 0 || index_to_find === 0) { 
                new_array_notes[index_to_find].no_select = false;
                unarchive_array_notes.push(new_array_notes[index_to_find]);
                new_array_notes.splice(index_to_find, 1); 
                notes_unarchived++;
            }
            new_array_index++;
        }

        try {
            data.array_notes = unarchive_array_notes;
            data.archived_notes = new_array_notes;  
            await AsyncStorage.setItem("data", JSON.stringify(data));
        }catch(error) {
            alert(error);
        }

        this.props.remove_color();
    }

    delete_note = async() => { //same login as change_color from color component
       
        let new_array_index = 0;
        let index_to_find = 0;
        let notes_deleted = 0;
        const new_array_notes = this.props.array_notes;
        const notes = this.props.selected_notes
        
        while(notes_deleted < notes.length) { 
            index_to_find = new_array_notes.findIndex(obj => obj.note_number === notes[new_array_index].note_number); 
            if (index_to_find != 0 || index_to_find === 0) { 
                new_array_notes.splice(index_to_find, 1); 
                notes_deleted++;
            }
            new_array_index++;
        }
        
        try {
            let data = JSON.parse(await AsyncStorage.getItem("data"));
            (this.props.screen != "home") ? data.archived_notes = new_array_notes : data.array_notes = new_array_notes;
            await AsyncStorage.setItem("data", JSON.stringify(data));
        }catch(error) {
            alert(error);
        }

        this.props.remove_color(new_array_notes);
    }

    share = async () => {
       
        try {
            
            const content = this.props.selected_notes[0].real_content;
        
            const result = await Share.share({
                message: content,
            });
        
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    alert("exito");
                }else {
                    return;
                }
            }

        } catch (error) {
            alert(error.message);
        }
    }

    show_hide_color = () => {
        this.setState((prevState) => ({show_hide_color: !prevState.show_hide_color}));
    }

    render() {

        const props = {
            screen: "popup_menu",
            array_notes: this.props.array_notes, 
            selected_notes: this.props.selected_notes, 
            navigation: this.props.navigation,
            remove_color: this.props.remove_color,
        }
        
        this.options_array[0].option = (this.props.screen != "home") ?  "Unarchive" : "Archive";
        this.options_array[0].option_icon = (this.props.screen != "home") ?  this.option_icon.unarchive : this.option_icon.archive;
        this.options_array[2].option_icon = (this.state.selected_notes_length > 1) ? this.option_icon.no_allow_edit : this.option_icon.allow_edit;
        this.options_array[3].option_icon = (this.state.selected_notes_length > 1) ? this.option_icon.no_allow_share : this.option_icon.alloW_share;
       
        return (
            <>
            <AppContext.Consumer>
                {({styles: {popup_backgroundColor}}) => (
                    <View style = {this.styles.container(popup_backgroundColor)}>
                        {this.options_array.map((option) => {
                            return (
                                <View key = {option.key} style = {this.styles.options}>
                                    <TouchableOpacity style = {this.styles.touchable} onPress = {() => this.select_option(option.key)}>
                                    <Text>{option.option_icon}</Text>
                                    </TouchableOpacity>
                                    <Text style = {this.styles.options}>{option.option}</Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </AppContext.Consumer>
                {this.state.show_hide_color ?
                    <Color 
                        {...props}>
                    </Color> 
                : null}  
            </>
        );
    }

    styles = StyleSheet.create({
        container: backgroundColor => ({
            backgroundColor: backgroundColor,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap",
            borderTopWidth: 2,
            borderColor: "black"
        }), 
        options: {
            fontSize: RFValue(20, Dimensions.get("window").height), 
            color: "black",
            justifyContent: "space-around",
            alignItems: "center"
        }, 
        touchable: {
            justifyContent: "space-around",
            alignItems: "center",
        },
        button: {
            backgroundColor: "yellow",
            borderRadius: (this.props.diameter/2),
            justifyContent: "center",
            alignContent: "center",
            width: this.props.diameter,
            height: this.props.diameter,
        }
    });
}

export default Popup_menu;