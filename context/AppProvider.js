import React, {Component} from "react";
import AsyncStorage from '@react-native-community/async-storage';

export const AppContext = React.createContext();

export class AppProvider extends Component {
    
    state = {
        dark: false,
    };

    componentDidMount() {
        this.load_mode();
    }
    
    dark_mode = async () => {
        
        try {

            this.save_mode();
            this.setState((prevState) => ({dark: !prevState.dark}));
            
        }catch(error) {

            alert(error);
        }
    }
     
    save_mode = async() => {
        const dark_mode_option = JSON.parse(await AsyncStorage.getItem("dark_mode"));
        const change_dark_mode = !dark_mode_option;
        await AsyncStorage.setItem("dark_mode", JSON.stringify(change_dark_mode));
    }

    load_mode = async() => {
        
        try {
            const dark_mode_option = await AsyncStorage.getItem("dark_mode");
            if (dark_mode_option != null) {
                this.setState({dark: JSON.parse(dark_mode_option)});
            } else {
                return;
            }
        }catch(error) {
            alert(error);
        }
    }

    render() {
        
        const dark = {
            state: this.state,
            actions: {
                dark_mode: this.dark_mode.bind(this)
            },
            styles: {
                backgroundColor: "#363635", //default black
                notes_backgroundColor: "#4D4D4C",
                drawer_backgroundColor: "#2F2F2E",
                drawer_icon_backgroundColor: "black",
                color: "white", //icon color or general uses
                fontColor: "white",
                popup_backgroundColor: "#292929",
                round_backgroundColor: "#1E90FF",
                icon_round_color: "white",
                childs_header_fontColor: "white",
                icon_check: "white",
                writeFontColor: "white",
            }
        };

        const light = {
            state: this.state,
            actions: {
                dark_mode: this.dark_mode.bind(this)
            },
            styles: {
                backgroundColor: "white",
                notes_backgroundColor: "white",
                drawer_backgroundColor: "white",
                drawer_icon_backgroundColor: "#ECECE9",
                color: "black",
                fontColor: "#1E90FF",
                round_backgroundColor: "white",
                icon_round_color: "#1E90FF",
                childs_header_fontColor: "#1E90FF",
                icon_check: "black",
                writeFontColor: "black",
            }
        };
        
        return (
            <AppContext.Provider value = {this.state.dark ? dark : light}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}