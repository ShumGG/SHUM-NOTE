import React, {Component} from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {MaterialIcons} from '@expo/vector-icons'; 
import * as ImagePicker from "expo-image-picker";
import Color from "../components/Color";
import {ScrollView} from "react-native-gesture-handler";
import Custom_modal from "../components/Custom_modal";
import {RFValue} from "react-native-responsive-fontsize";
import {AppContext} from "../context/AppProvider";

class Edit_note extends Component { 

    state = {
        content: "",    
        update_notes: "", 
        color: false, //this will be used only for re render
        fetch_notes: "",
        editable: false,
        load: false,
        modal: false,
    }

    richText = React.createRef();
    option_icon = {
        size: RFValue(30, Math.round(Dimensions.get("window").height)),
        color: "black",
    }
    
    array_notes = [];
    note = "";
    text_color = "";
    background = "";
    scroll_position = 0;
    maximun_scroll_position = 0;
    should_scroll = false;
    uri = "";
    images_uri_array = "";
    
    componentDidMount() {
        this.props.navigation.setParams({save_changes: this.save_changes});
        const {params} = this.props.navigation.state;
        this.array_notes = params.data.array_notes;
        this.note = params.data.selected_note;
        this.text_color = this.note[0].text_color;
        this.background = this.note[0].color;
        this.uri = this.note[0].uri;
        this.images_uri_array = this.note[0].images_uri;
        this.setState({content: this.note[0].content});
        console.log("ULTIMO URI DEL NOTE:" + this.uri);
        console.log("ARRAY DE URI DEL NOTE:" + this.images_uri_array);
    }

    save_changes = async() => {

        this.set_Image();
        let clear_real_content = this.state.content.replace(/<[^>]*>/g, " ");
        clear_real_content = clear_real_content.replace("&nbsp;", "");
      
        try {
        
            const data = JSON.parse(await AsyncStorage.getItem("data"));
            const index_to_find = this.array_notes.findIndex(obj => obj.note_number === this.note[0].note_number); 
       
            const edited_note = this.note.map((note) => {
                note.content = this.state.content;
                note.real_content = clear_real_content.trim(); //deletes all the spaces 
                note.images_uri = this.images_uri_array;
                note.uri = this.uri;
                return {...note}
            });
            
            console.log("ULTIMO URI DEL NOTE ACTUALIZADO:" + this.uri);
            console.log("ARRAY DE URI DEL NOTE ACTUALIZADO:" + this.images_uri_array);
            console.log("NOTE ACTUALIZADO:");
            for (i = 0 ; i < edited_note.length ; i++) {
                console.log(edited_note[i]);
            }
            
            this.array_notes.splice(index_to_find, 1, edited_note[0]);
            data.array_notes = this.array_notes;
            await AsyncStorage.setItem("data", JSON.stringify(data));
            this.show_modal();

        }catch(error) {
            alert(error);
        }
    }

    set_Image = () => {
        
        let new_images_uris = this.state.content.match(/(?=<img src=).*?(?=>)/g);
        let image_found = false;
        let new_uri = "";
        let i = 0;

        if (new_images_uris === null) {
            this.uri = "";
            this.images_uri_array = [];
        }else {
            
            this.images_uri_array = new_images_uris.map(function(uris) {
                return uris.replace("<img src=", "");
            });
            
            while (i < this.images_uri_array.length && !image_found) {
                if (this.images_uri_array[i].match(this.uri)) {
                    image_found = true;
                }else {
                    i++;
                }
            }
            
            if (image_found) {
                return;
            }else {
                new_uri = this.images_uri_array[this.images_uri_array.length - 1];
                this.uri = new_uri.replace(/"/g, "");
            }
        }
    }

    show_modal = () => {
        this.setState((prevState) => ({modal: !prevState.modal}));
    }

    insertImage = async() => {
     
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });
        
        if (!result.cancelled) {
            let uri = result.uri;
            let clear_content = uri.replace("file:/","file:///"); 
            this.uri = clear_content;
            this.richText.current?.insertImage(clear_content);
        }else {
            return;
        }
    }
    
    change_color = () => {  
       this.setState((prevState) => ({color: !prevState.color}));
    }

    update_color(new_array_notes) {
        this.array_notes = new_array_notes;
        this.text_color = new_array_notes[0].text_color;
        this.setState((prevState) => ({color: !prevState.color}));
    }

    load = () => {
        this.setState((prevState) => ({load: !prevState.load}));
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

    background_color = (dark, backgroundColor) => {
        if (dark) {
            return (this.background != "white") ? this.background : backgroundColor;
        }else {
            return (this.background != "white") ? this.background : backgroundColor;
        }
    }
    render() {
    
        const props = {
            screen: "edit_note",
            navigation: this.props.navigation,
            array_notes: this.array_notes,
            note: this.note,
            change_color: this.change_color.bind(this),
            update_color: this.update_color.bind(this),
            show_modal: this.show_modal.bind(this),
        } 

        return (
            <>
            <AppContext.Consumer>
                {({state: {dark}, styles: {backgroundColor}}) => (
                    <ScrollView  style = {{backgroundColor: this.background_color(dark, backgroundColor)}} onScroll = {this.scrollposition} ref = {ref => {this.scrollview = ref}} onContentSizeChange = {this.scrollDown}>
                       <RichEditor
                            editorStyle = {{
                                backgroundColor: this.background_color(dark, backgroundColor),
                                color: this.text_color,
                                contentCSSText: "font-size: 30px;",
                            }}
                            ref = {this.richText}
                            allowFileAccess = {true}
                            scrollEnabled = {false}
                            initialContentHTML = {this.state.content}
                            editorInitializedCallback = {this.load}
                            useContainer = {true}
                            onChange = {text => this.setState({content: text}, () => console.log(this.state.content))}>
                        </RichEditor>
                    </ScrollView>
                )}
            </AppContext.Consumer>
                {this.state.color ? 
                    <Color
                        {...props}>
                    </Color>
                : null}
            <AppContext.Consumer>
                {({state: {dark}, styles: {backgroundColor}}) => (
                    <RichToolbar
                        editor = {this.richText}
                        onPressAddImage = {this.insertImage}
                        actions  ={[
                            actions.insertBulletsList,
                            actions.insertImage,
                            actions.insertOrderedList,
                            'customAction',
                        ]}
                        iconMap={{
                            [actions.insertBulletsList]: () => <Text style = {this.styles.icon}><MaterialIcons name = "format-list-bulleted" size = {this.option_icon.size} color = {this.option_icon.color}/></Text>,
                            [actions.insertOrderedList]: () => <Text style = {this.styles.icon}><MaterialIcons name = "format-list-numbered" size = {this.option_icon.size} color = {this.option_icon.color}/></Text>,
                            [actions.insertImage]: () => <Text style = {this.styles.icon}><MaterialIcons name = "image" size = {this.option_icon.size} color = {this.option_icon.color}/></Text>,
                            customAction: () => <Text style = {this.styles.icon}><MaterialIcons name = "format-color-text" size = {this.option_icon.size} color = {this.option_icon.color}/></Text>,
                        }}
                        customAction = {this.change_color}
                        style = {{backgroundColor: this.background_color(dark, backgroundColor), borderTopWidth: 1}}>
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
        check: {
            position: "absolute",
            marginTop: -20,
            backgroundColor: "red",
        },
    });
 
}

export default Edit_note;