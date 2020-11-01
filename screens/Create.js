import React, {Component} from "react";
import Create_note from "../components/Create_note";

class Create extends Component {
    render() {
        return  (
            <>
                <Create_note navigation = {this.props.navigation}></Create_note>
            </>    
        );
    }
}

export default Create;
