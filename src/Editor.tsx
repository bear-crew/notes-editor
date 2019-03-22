import { Editor, EditorState } from 'draft-js';
import * as React from 'react';
import './Editor.css';
import Toolbar from './Toolbar/Toolbar';

class ReactEditor extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };
    }

    public render() {
        return (
            <div className='bear-editor'>
                <Editor
                key='editor'
                editorState={this.state.editorState}
                onChange={this.onChange}
                />
                <Toolbar 
                key='toolbar'
                editorState={this.state.editorState}
                onChange={this.onChange}
                />
            </div>
        )
    }

    private onChange = (editorState: EditorState) => {
        this.setState({editorState});
    }
}

export default ReactEditor;