import React, {Component} from "react";
import Notes from "../components/Notes";
import {fetch_notes} from "../helpers/General_functions";

class Archive extends Component {

    state = {
        archived_array_notes: [],
    }

    componentDidMount() { 
        this.props.navigation.addListener("didFocus", () => this.fetch_notes());
    }
 
    fetch_notes = async() => {
        try {
            const data = await fetch_notes();
            if (typeof data != "function") {
                this.setState({archived_array_notes: data.archived_notes});
            }else {
                data();
            }
        }catch (error) {
            alert(error);
        }
    }
    
    render() {
        
        const props = {
            screen: "archived_notes",
            array_notes: this.state.archived_array_notes,
        }

        return (
            <>  
                <Notes {...props} navigation = {this.props.navigation}></Notes>
            </>
        );
    }
}

export default Archive;
