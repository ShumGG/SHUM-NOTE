import React, {Component} from "react";
import Notes from "../components/Notes";
import {fetch_notes} from "../helpers/General_functions";

class Home extends Component {

    state = {
        array_notes: [],
    }

    componentDidMount() {    
        this.props.navigation.addListener("didFocus", () => this.fetch_notes());
    }   
    
    fetch_notes = async() => {                  //fetch all the data
        const data = await fetch_notes();
        if (typeof data != "function") {
            this.setState({array_notes: data.array_notes});
        }else {
            data();
        }
    }

    render() {
        
        const props = {
            screen: "home",
            array_notes: this.state.array_notes,
        }

        return (
            <>
                <Notes {...props} navigation = {this.props.navigation}></Notes>
            </>
        );
    }
}

export default Home;


