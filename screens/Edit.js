import React, { Component } from "react";
import Edit_note from "../components/Edit_note";

class Edit extends Component { 
    render() {
        return (
            <>
                <Edit_note navigation = {this.props.navigation}></Edit_note>
            </>
        );
    }
}
export default Edit;
