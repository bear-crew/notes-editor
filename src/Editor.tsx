import { Editor, EditorState, RichUtils } from 'draft-js';
import * as React from 'react';

class ReactEditor extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };
    }

    public render() { 
        return [
            <Editor
            key='editor'
            editorState={this.state.editorState}
            onChange={this.onChange}
            />,
            <button key='bold' onClick={this.bold}>Bold</button>
        ];
    }

    private onChange = (editorState: EditorState) => {
        this.setState({editorState});
    }

    private bold = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }
}
 
export default ReactEditor;