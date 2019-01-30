import { Editor, EditorState } from 'draft-js';
import React, { Component } from 'react';

class ReactEditor extends Component {
    state = {
        editorState: EditorState.createEmpty()
    }

    onChange = (editorState) => {
        this.setState({editorState});
        console.log(this.state.editorState.getCurrentContent());
    }

    render() { 
        return (
            <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            />
        );
    }
}
 
export default ReactEditor;