import { getVisibleSelectionRect, RichUtils } from 'draft-js';
import * as React from 'react';
import './Toolbar.css';

class Toolbar extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {

        };
    }

    public componentDidUpdate() {
        const toolbarNodes = document.getElementsByClassName('toolbar') as HTMLCollectionOf<HTMLElement>;
        const [style, className] = this.getStyle();
        toolbarNodes[0].style.top = `${style.top}px`;
        toolbarNodes[0].style.left = `${style.left}px`;
        toolbarNodes[0].style.visibility = `${style.visibility}`;

        if (className === '') {
            toolbarNodes[0].className = 'toolbar';
        }
        else if (className === 'bubble-bottom-r') {
            toolbarNodes[0].className = 'toolbar bubble-bottom-r';
        }
        else if (className === 'bubble-bottom-l') {
            toolbarNodes[0].className = 'toolbar bubble-bottom-l';
        }
        else if (className === 'bubble-top') {
            toolbarNodes[0].className = 'toolbar bubble-top';
        }
        else if (className === 'bubble-top-r') {
            toolbarNodes[0].className = 'toolbar bubble-top-r';
        }
        else if (className === 'bubble-top-l') {
            toolbarNodes[0].className = 'toolbar bubble-top-l';
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
            <div className="toolbar" key="toolbar" style={style}>
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
        const selectRect = getVisibleSelectionRect(window);
        let position;
        const toolBarWidth = 197; // TODO: change to dynamic width
        const toolBarHeight = 118;
        const extraOffset = 5;

        if (selectRect) {
            position = {
                left: selectRect.left - toolBarWidth/2 + selectRect.width/2 - editorRect.left,
                top: selectRect.bottom + extraOffset - editorRect.top
            };

            if (position.left + toolBarWidth + editorRect.left > editorRect.right) { // toolbar moves right too much
                if (editorRect.top + position.top + toolBarHeight > editorRect.bottom) { // right and down
                    position.top = selectRect.top - toolBarHeight - editorRect.top;
                    className = 'bubble-top-r';
                }
                else {
                    className = 'bubble-bottom-r';
                }
                position.left = (selectRect.right - selectRect.width/2) - (toolBarWidth - 5) - editorRect.left;
            } 
            
            else if (position.left < 0) { // toolbar moves left too much
                if (editorRect.top + position.top + toolBarHeight > editorRect.bottom) { // left and down
                    position.top = selectRect.top - toolBarHeight - editorRect.top;
                    className = 'bubble-top-l';
                }
                else {
                    className = 'bubble-bottom-l';
                }
                position.left = (selectRect.left + selectRect.width/2 - 5) - editorRect.left;
            } 
            
            else if (editorRect.top + position.top + toolBarHeight > editorRect.bottom) { // toolbar moves down too much
                position.top = selectRect.top - toolBarHeight - editorRect.top;
                className = 'bubble-top';
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