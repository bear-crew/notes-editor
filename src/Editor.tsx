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
            <div className='bear-editor' onDragOver={this.preventDragging} onDrag={this.preventDragging} onDragEnter={this.preventDragging} onDragStart={this.preventDragging} onDragLeave={this.preventDragging}>
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

    private preventDragging = (event: React.DragEvent<HTMLDivElement>) : boolean => {
        event.preventDefault();
        return false;
    }
}

export default ReactEditor;