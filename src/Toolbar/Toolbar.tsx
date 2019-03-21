import { getVisibleSelectionRect, RichUtils } from 'draft-js';
import * as React from 'react';
import './Toolbar.css';

class Toolbar extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {

        };
    }

    // public componentDidMount() {
    //     console.log("Did mount");
    // }

    public componentDidUpdate() {
        const toolbarNodes = document.getElementsByClassName('toolbar') as HTMLCollectionOf<HTMLElement>;
        const [style, className] = this.getStyle();
        toolbarNodes[0].style.top = `${style.top}px`;
        toolbarNodes[0].style.left = `${style.left}px`;
        toolbarNodes[0].style.visibility = `${style.visibility}`;

        if(className === '') {
            toolbarNodes[0].className = 'toolbar';
        }
        else if(className === 'right-bubble') {
            toolbarNodes[0].className = 'toolbar right-bubble';
        }
        else if(className === 'left-bubble') {
            toolbarNodes[0].className = 'toolbar left-bubble';
        }
 
    }

    public render() {
        const style = {
            left: 0,
            position: 'absolute',
            top: 0,
            visibility: 'hidden'
        } as React.CSSProperties;
        return (
            <div className="toolbar" key="toolbar" style={style} >
                <div className="toolbar-column">
                    <button type="button" className='bold' onMouseDown={this.bold} />
                    <button type="button" className='ord-list' onMouseDown={this.ordList} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className='italic' onMouseDown={this.italic} />
                    <button type="button" className='unord-list' onMouseDown={this.unordList} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className='h2' onMouseDown={this.h2} />
                    <button type="button" className='blockquote' onMouseDown={this.blockquote} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className='h3' onMouseDown={this.h3} />
                    <button type="button" className='link' />
                </div>
            </div>
        );
    }    

    private getStyle = (): [React.CSSProperties, string] => {
        const style = {
            left: 0,
            position: 'absolute',
            top: 0,
            visibility: 'hidden'
        } as React.CSSProperties;
        let className = '';
        const selection = this.props.editorState.getSelection();

        if( !selection.getHasFocus() || selection.isCollapsed() ) {
            return [style, className];
        }

        const editorElement = document.getElementsByClassName('DraftEditor-root')[0];

        if(!editorElement) {
            return [style, className];
        }

        const editorRect = editorElement.getBoundingClientRect();
        const leftOffset = editorRect.left;
        const topOffset = editorRect.top;
        const selectRect = getVisibleSelectionRect(window);
        let position;
        const toolBarWidth = 196; // TODO
        const extraOffset = 5;
        if(selectRect) {
            position = {
                left: selectRect.left - toolBarWidth/2 + selectRect.width/2 - leftOffset,
                top: selectRect.bottom + extraOffset - topOffset
            };

            if(position.left + toolBarWidth + leftOffset > editorRect.right) {
                position.left = (selectRect.right - selectRect.width/2) - (toolBarWidth-5) - leftOffset;
                className = 'right-bubble';
            }

            if(position.left < 0) {
                position.left = (selectRect.left + selectRect.width/2-5) - leftOffset;
                className = 'left-bubble';
            }
            style.left = position.left;
            style.top = position.top;
        }

        
        style.visibility = 'visible';
        return [style, className];
    }

    private bold = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD'));
    }

    private italic = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'ITALIC'));
    }

    private h2 = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, 'header-two'));
    }

    private h3 = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, 'header-three'));
    }

    private ordList = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, 'ordered-list-item'));
    }

    private unordList = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, 'unordered-list-item'));
    }

    private blockquote = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, 'blockquote'));
    }
}
 
export default Toolbar;