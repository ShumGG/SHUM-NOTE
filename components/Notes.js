import React, {Component} from "react";
import {StyleSheet, View, Text, Image, Dimensions} from "react-native";
import {FlatList, TouchableOpacity} from "react-native-gesture-handler";
import Popup_menu from "../components/Popup_menu";
import Round_button from "../components/Round_button";
import {Feather} from '@expo/vector-icons'; 
import {RFValue} from "react-native-responsive-fontsize";
import {AppContext} from "../context/AppProvider";
import { MaterialIcons } from '@expo/vector-icons'; 

class Notes extends Component {

    state = {
        onpress: false,
        array_notes: [],
        selected_notes: [],
        update: false,
    }
    
    note = "";
    note_index = "";
    note_number = "";
    item_selected = 0;
    open_popmenu = false;

    show_hide_popup_menu = (item) => { 
      
        if (this.item_selected === 0) {         //if theres no item selected the menu will show up
            this.open_popmenu = !this.open_popmenu;
            this.note = item;
            this.set_color();
        }else {
            return;
        }
    }

    select_edit(item) {
        if (this.open_popmenu) {
            this.note = item;
            this.set_color();
        }else {
            let selected_note = [];
            selected_note.push(item);
            this.props.navigation.navigate("Edit", {data: {"selected_note": selected_note, "array_notes": this.props.array_notes}});
        }
    }

    set_color = () => {                                             //this function is used to set style to the componets
       
        if (!this.note.no_select) { //doesnt exist or false
            
            const selected_note = this.state.selected_notes;
            this.note_index = this.props.array_notes.findIndex(obj => obj.note_number === this.note.note_number); 
            this.note.no_select = true;                             //true set the color to gray
            this.props.array_notes.splice(this.note_index, 1, this.note);
            selected_note.push(this.note);
            this.item_selected = this.item_selected + 1;
            this.setState({array_notes: this.props.array_notes, selected_notes: selected_note});
       
        }else {
     
            const deselected_note = this.state.selected_notes;
            this.note_index = this.props.array_notes.findIndex(obj => obj.note_number === this.note.note_number); 
            this.note.no_select = false;                            //false set the color to default
            this.props.array_notes.splice(this.note_index, 1, this.note);
            this.note_index = deselected_note.findIndex(obj => obj.note_number === this.note.note_number);
            deselected_note.splice(this.note_index, 1);              //delete it from the selected_notes array
            this.item_selected = this.item_selected - 1;
           
            if (this.item_selected === 0) {
                this.open_popmenu = !this.open_popmenu; //if theres at least one item selected, the menu still visible
            }                   
    
            this.setState({array_notes: this.props.array_notes, selected_notes: deselected_note}); //set the new arrays*/
        }
    }

    remove_color = () => {
       
        this.open_popmenu = !this.open_popmenu;
        this.item_selected = 0;
        const new_array_notes = this.props.array_notes.map((note) => {
            note.no_select = false;
            return {...note};
        });
        this.setState({array_notes: new_array_notes, selected_notes: []});
    }

    select_all = () => {

        let selected_all_notes = this.props.array_notes.map((note) => {
            note.no_select = true;
            return {...note};
        });
        this.item_selected = selected_all_notes.length;
        this.setState({selected_notes: selected_all_notes});
    
    }

    render() {
        const props = {
            screen: this.props.screen,
            array_notes: this.state.array_notes, 
            selected_notes: this.state.selected_notes, 
            navigation: this.props.navigation,
            remove_color: this.remove_color.bind(this),
            show_hide_popup_menu: this.show_hide_popup_menu.bind(this),
        }
        return (
            <>
            <AppContext.Consumer>
            {({state: {dark}, styles: {backgroundColor, notes_backgroundColor, color}}) => (
                <View style = {this.styles.container(backgroundColor)}>
                    {this.open_popmenu ? 
                        <View  style = {this.styles.selected_container}>    
                            <View style = {this.styles.selected_items}>
                                <TouchableOpacity onPress = {this.remove_color}>
                                    <Text style = {this.styles.x_icon}> <Feather name = "x" size = {28} color = {color}/></Text>
                                </TouchableOpacity>
                                <Text style = {this.styles.number_items(color)}>
                                    {this.item_selected + "/" + this.props.array_notes.length}
                                </Text>
                            </View> 
                            <View styles = {this.styles.select_all_icon}>
                                <TouchableOpacity onPress = {this.select_all}>
                                    <Text style = {this.styles.select_all_icon}> <MaterialIcons name = "select-all" size = {28} color = {color}/></Text>
                                </TouchableOpacity>
                            </View>
                        </View> 
                    : null}
                        <FlatList 
                            keyExtractor = {(item) =>item.note_number.toString()}
                            data = {this.props.array_notes} 
                            renderItem = {({item}) => (
                            <TouchableOpacity 
                                onLongPress = {() => this.show_hide_popup_menu(item)}
                                onPress = {() => this.select_edit(item)}
                                activeOpacity = {0.9}>
                            {                                //string from 0 to 15, dots to get until 19 length
                                (!item.uri) ? 
                                <View style = {this.styles.notes_container(dark, notes_backgroundColor, item)}>
                                    <Text style = {this.styles.notes(item)}>
                                        {                                //string from 0 to 15, dots to get until 19 length
                                            (item.real_content.length > 19) ? 
                                                item.real_content.substring(0,15).padEnd(19, ".") 
                                                : (item.real_content === "") ? "No content" : item.real_content
                                        }
                                    </Text>
                                </View> 
                                :
                                <View style = {this.styles.notes_container_image(dark, notes_backgroundColor, item)}>
                                    {
                                        (item.content.startsWith("<br>")) ? 
                                            <Image source = {{uri: item.uri}} style = {{width: 50, height: 50}}></Image>
                                        : 
                                        <>
                                            <Text style = {this.styles.notes(item)}> 
                                                {
                                                    (item.real_content.length > 19) ? 
                                                    item.real_content.substring(0,15).padEnd(19, ".") 
                                                    : (item.real_content === "") ? "No content" : item.real_content
                                                }
                                            </Text>
                                                {
                                                    item.real_content === "" ? null : 
                                                    <Image source = {{uri: item.uri}} style = {{width: 50, height: 50}}></Image>
                                                }
                                        </>
                                    }
                                </View>
                            }
                            </TouchableOpacity>)}
                            contentContainerStyle = {{flexGrow:1}}>
                        </FlatList>
                    {this.open_popmenu ? null  : 
                        this.props.screen === "home" ? 
                            <Round_button 
                                diameter = {60}
                                navigation = {this.props.navigation}>
                            </Round_button> 
                        : null
                    }
                    {this.open_popmenu ? 
                        <Popup_menu 
                            {...props}>
                        </Popup_menu>
                    : null}
                </View>
            )}
                    </AppContext.Consumer>
            </>
        );
    }

    color(dark, notes_backgroundColor, item) { 

        if (!item.no_select) {  //if true   
            if (dark) { //validates if dark mode is activated
                if (item.color != "white") { //if its, validates if the container has another color
                    return item.color; //if it does, return it
                }else {
                    return notes_backgroundColor; //it doesnt, return the dark mode color
                }
            }
            return item.color; //if dark mode is not activated, return its color
        }else {
            return "rgba(128,128,128,0.5)"; //if its false, apply the select color
        }
    }
    
    styles = StyleSheet.create({
        container: backgroundColor => ({
            flex: 1,
            backgroundColor: backgroundColor,
        }),
        notes_container: (dark, notes_backgroundColor, item) => ({
            backgroundColor: this.color(dark, notes_backgroundColor, item),
            padding: 15,
            borderRadius: 8,
            elevation: 5,
            shadowOpacity: 1,
            shadowRadius: 5,
            marginHorizontal: 5,
            marginVertical: 15,
        }),
        notes_container_image: (dark, notes_backgroundColor, item) => ({
            backgroundColor: this.color(dark, notes_backgroundColor, item),
            padding: 15,
            borderRadius: 8,
            elevation: 4,
            shadowOpacity: 1,
            shadowRadius: 5,
            marginHorizontal: 4,
            marginVertical: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        }),
        notes: item => ({
            fontSize: RFValue(33, Math.round(Dimensions.get("window").height) * 1.3),
            color: (!item.text_color) ? "black" : item.text_color, //contents color
            alignContent: "center",
            justifyContent: "flex-start",
        }),
        selected_container: {
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            marginTop: 5,
        },  
        selected_items: {
            flexDirection: "row",
            alignItems: "center",
        },  
        x_icon: {
            marginTop: 12, 
            paddingRight: 10, 
            paddingLeft: 10,
        },
        select_all_icon: {
            paddingRight: 20, 
            marginTop: 18,
            flexDirection: "row", 
            alignSelf: "center",
        },
        number_items: color => ({
            fontSize: RFValue(30, Math.round(Dimensions.get("window").height)), 
            marginTop: 5, 
            color: color,
        })
    });
}

export default Notes;