import { Editor, EditorState, RichUtils } from 'draft-js';
import * as React from 'react';
import './Editor.css';

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
            <div className="toolbar" key="toolbar">
                <div className="toolbar-column">
                    <button type="button" className='bold' onClick={this.bold} />
                    <button type="button" className='ord-list' onClick={this.ordList} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className='italic' onClick={this.italic} />
                    <button type="button" className='unord-list' onClick={this.unordList} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className='h2' onClick={this.h2} />
                    <button type="button" className='blockquote' onClick={this.blockquote} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className='h3' onClick={this.h3} />
                    <button type="button" className='link' />
                </div>
            </div>
        ];
    }

    private onChange = (editorState: EditorState) => {
        this.setState({editorState});
    }

    private bold = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    }

    private italic = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    }

    private h2 = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-two'));
    }

    private h3 = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-three'));
    }

    private ordList = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
    }

    private unordList = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
    }

    private blockquote = () => {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'blockquote'));
    }
}
 
export default ReactEditor;