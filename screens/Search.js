import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Notes from "../components/Notes";
import {fetch_notes} from "../helpers/General_functions";
import {AppContext} from "../context/AppProvider";
import {TextInput} from "react-native-gesture-handler";
import {RFValue} from "react-native-responsive-fontsize";

class Search extends Component {

    state = {
        array_notes: [],
        search_array_notes: "",
        no_results: true,
        clean: false,
    }

    componentDidMount() {    
        this.props.navigation.addListener("didFocus", () => this.fetch_notes());
    }   
    
    fetch_notes = async() => {                  //fetch all the data
        const data = await fetch_notes();
        const {params} = this.props.navigation.state;
        if (typeof data != "function") { 
            if (params.data.screen === "Shum Note") {
                this.setState({array_notes: data.array_notes});
            }else {
                this.setState({array_notes: data.archived_notes});
            }
        }else {
            data();
        }
    }

    search_note = (note) => {
 
        if (note === "") {
            this.setState({search_array_notes: [], no_results: true});
        }else {
            const array_notes = this.state.array_notes;
            const search_notes = array_notes.filter(notes => notes.real_content.toUpperCase().includes(note.toUpperCase()));
            if (search_notes.length === 0) {
                this.setState({search_array_notes: [], no_results: false});
            }else {
                this.setState({search_array_notes: search_notes, no_results: true});
            }
        }
    }
    
    render() {
        
        const props = {
            screen: "home",
            array_notes: this.state.search_array_notes,
        }

        return (
            <>
                <TextInput 
                    placeholder = "Search" 
                    onChangeText = {note => this.search_note(note)}
                    maxLength = {20}
                    style = {{paddingLeft: 20, paddingRight: 20, height: 50}}
                    autoFocus = {true}>
                </TextInput>
                <AppContext.Consumer>
                    {({styles : {backgroundColor, fontColor}}) => (
                        <View style = {this.styles.container(backgroundColor)}>
                            {this.state.search_array_notes.length === 0 && !this.state.no_results ?  
                                <Text style = {this.styles.text(fontColor)}>No results.</Text> 
                                : 
                                <Notes {...props} navigation = {this.props.navigation}></Notes>
                            }
                        </View>
                    )}
                </AppContext.Consumer>
            </>
        );
    }

    styles = StyleSheet.create({  
        input: {

        },
        container: backgroundColor => ({
            flex: 1,
            justifyContent: "center",
            backgroundColor: backgroundColor
        }),
        text: fontColor => ({
            alignSelf: "center",
            fontSize: RFValue(25, Math.round(Dimensions.get("window").height)),
            fontFamily: "serif",
            textAlign: "center",
            color: fontColor,
        })
    })
}

export default Search;
