import { EditorState } from 'draft-js';
import createImagePlugin from 'draft-js-image-plugin';
import Editor from 'draft-js-plugins-editor';
import * as React from 'react';
import './Editor.css';
import Toolbar from './Toolbar/Toolbar';
const imagePlugin = createImagePlugin();


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
                plugins={[imagePlugin]}
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