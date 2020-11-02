import React, {Component } from "react";
import {StyleSheet, Text, StatusBar, Dimensions, Image} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {MaterialIcons} from '@expo/vector-icons'; 
import * as ImagePicker from "expo-image-picker";
import Color from "../components/Color";
import {ScrollView} from "react-native-gesture-handler";
import Custom_modal from "../components/Custom_modal";
import {RFValue} from "react-native-responsive-fontsize";
import {AppContext} from "../context/AppProvider";

class Create_note extends Component {
    
    state = {
        structure: "",
        content: "",
        default_color: "white", //default color (cyan)
        color: "",
        change_color: false,
        modal: false,
    }
    
    richText = React.createRef();
    option_icon = {
        size: RFValue(30, Math.round(Dimensions.get("window").height)),
        color: "black",
    }
    scroll_position = 0;
    maximun_scroll_position = 0;
    should_scroll = false;
    uri = ""; //global uri to save the last image inserted when creating the note
    images_uri = []; //global array of images uri to save each image inserted
    content = "";

    componentDidMount() {
        this.props.navigation.setParams({save_data: this.save_data});
    }

    save_data = async() => {
        
        let clear_real_content = this.state.content.replace(/<[^>]*>/g, " ");
        clear_real_content = clear_real_content.replace(/&nbsp;/g, "");

        if (clear_real_content.trim() === "" && this.uri === "") { // trims removes blank spaces from both sides of the string, strings in this context are (blank spaces, tabs, characters without content)
        
            this.props.navigation.navigate("Home");
        
        } else {

            try {
                const data = await AsyncStorage.getItem("data");
                if (data === null) {
                    const data = {"array_notes": [], "last_note": 0}; 
                    const last_note = data.last_note + 1;
                    const new_note = {
                        note_number: last_note, //create a new_note object, note_number will be the key for each note
                        content: this.state.content, 
                        color: this.state.default_color, 
                        text_color: this.state.color, 
                        uri: this.uri,
                        real_content: clear_real_content,
                        images_uri: this.images_uri,
                    }; 
                    const array_notes = [];
                    array_notes.push(new_note);
                    data.array_notes = array_notes; 
                    data.last_note = last_note;
                    await AsyncStorage.setItem("data", JSON.stringify(data)); //using stringify to save the array 
                    this.setState((prevState) => ({modal: !prevState.modal}));
                }else {
                    const data = JSON.parse(await AsyncStorage.getItem("data")); //use parse to acces to the data of the array
                    const last_note = data.last_note + 1;
                    const new_note = {
                        note_number: last_note, 
                        content: this.state.content, 
                        color: this.state.default_color, 
                        text_color: this.state.color, 
                        uri: this.uri,
                        real_content: clear_real_content,
                        images_uri: this.images_uri,
                    };
                    const array_notes = data.array_notes;
                    array_notes.push(new_note);
                    data.array_notes = array_notes;
                    data.last_note = last_note;
                    await AsyncStorage.setItem("data", JSON.stringify(data));
                    this.setState((prevState) => ({modal: !prevState.modal}));
                } 
    
            } catch(error) {
                alert(error);
            }
        }
    }
    
    insertImage = async () => {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1
        });
        
        if (!result.cancelled) {
            let uri = result.uri;
            let clear_content = uri.replace("file:/","file:///"); //replace al &nbsp;
            this.uri = clear_content;
            this.images_uri.push(this.uri);
            this.richText.current?.insertImage(clear_content);
        }else {
            return;
        }
    }
    
    change_color = async () => {  
        this.setState((prevState) => ({change_color: !prevState.change_color}));
    }

    update_color = (color) => {
        this.setState((prevState) => ({change_color: !prevState.change_color, color: color}));
    }

    scrollposition = (event) => {

        if (this.scroll_position === 0) {
            this.scroll_position = event.nativeEvent.contentOffset.y;
        }else {
            if (event.nativeEvent.contentOffset.y > this.scroll_position ) {
                this.scroll_position = event.nativeEvent.contentOffset.y;        
                this.maximun_scroll_position = this.scroll_position;
                this.should_scroll = true;
            }else {
                this.should_scroll = false;
            }
        }
        if (event.nativeEvent.contentOffset.y < this.maximun_scroll) {
            this.should_scroll = false;
        }
    }

    scrollDown = () => {
        if (this.should_scroll) {
            this.scrollview.scrollToEnd();
        }else {
            return;
        }
    }

    color_text  = (dark, writeFontColor) => {
        if (dark) {
            return (this.state.color  === "") ? writeFontColor : this.state.color;
        }else {
            return (this.state.color  === "") ? writeFontColor : this.state.color;
        }
    }

    render() {

        const props = {
            screen: "create_note",
            navigation: this.props.navigation,
            change_color: this.change_color.bind(this),
            update_color: this.update_color.bind(this),
        }

        return (
            <>
            <AppContext.Consumer>
                {({state: {dark}, styles: {drawer_backgroundColor, writeFontColor}}) => (
                    <ScrollView  style = {{backgroundColor: drawer_backgroundColor}} onScroll = {this.scrollposition} ref = {ref => {this.scrollview = ref}} onContentSizeChange = {this.scrollDown}>                    
                        <RichEditor
                            editorStyle = {{
                                backgroundColor: drawer_backgroundColor,
                                color: this.color_text(dark, writeFontColor),
                                contentCSSText: "font-size: 30px;",
                            }}
                            ref = {this.richText}
                            onChange = {text => this.setState({content:text})}
                            allowFileAccess = {true}
                            >
                        </RichEditor>
                    </ScrollView>    
                )}
            </AppContext.Consumer>
                {this.state.change_color ? 
                    <Color
                        {...props}>
                    </Color>
                : null}
            <AppContext.Consumer>
                {({styles: {backgroundColor}}) => (
                    <RichToolbar
                        
                        editor = {this.richText}
                        actions = {[
                            actions.insertBulletsList,
                            actions.insertOrderedList,
                            actions.insertImage,
                            "change_text_color", 
                        ]}
                        iconMap  ={{
                            [actions.insertBulletsList]: () => <Text style = {this.styles.icon}><MaterialIcons name = "format-list-bulleted" size = {this.option_icon.size} color = {this.option_icon.color}/></Text>,
                            [actions.insertOrderedList]: () => <Text style = {this.styles.icon}><MaterialIcons name = "format-list-numbered" size = {this.option_icon.size} color = {this.option_icon.color}/></Text>,
                            [actions.insertImage]: () => <Text style = {this.styles.icon}><MaterialIcons name = "image" size = {this.option_icon.size} color = {this.option_icon.color}/></Text>,
                            change_text_color: () => <Text style = {this.styles.icon}><MaterialIcons name = "format-color-text" size = {this.option_icon.size} color = {this.option_icon.color}/></Text>,
                        }}
                        change_text_color = {this.change_color}
                        style = {{backgroundColor: backgroundColor, borderTopWidth: 1}}>
                    </RichToolbar>
                )}
                </AppContext.Consumer>
                {this.state.modal ? 
                    <Custom_modal {...props}></Custom_modal>
                : null}
            </>
        );
    }

    styles = StyleSheet.create({
        container: {
            marginTop: StatusBar.currentHeight,
        },  
        icon: {
            textAlign: "center",
        },
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
    });

}

export default Create_note;
