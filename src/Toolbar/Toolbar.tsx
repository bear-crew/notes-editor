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
        const style = this.getStyle();
        toolbarNodes[0].style.top = `${style.top}px`;
        toolbarNodes[0].style.left = `${style.left}px`;
        toolbarNodes[0].style.visibility = `${style.visibility}`;
        console.log(style);
    }

    public render() {
        const style = {
            position: 'absolute',
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

    private getStyle = () => {
        const style = {
            position: 'absolute',
            visibility: 'hidden'
        } as React.CSSProperties;

        const editorElement = document.getElementById('root');
        if(!editorElement) {
            return style;
        }

        const editorRect = editorElement.getBoundingClientRect();
        const leftOffset = editorRect.left;
        const topOffset = editorRect.top;
        const selectRect = getVisibleSelectionRect(window);
        let position;
        const toolBarWidth = 98;
        const extraOffset = 5;
        if(selectRect) {
            position = {
                left: selectRect.left - toolBarWidth + selectRect.width/2 - leftOffset,
                top: selectRect.bottom + extraOffset - topOffset
            };

            style.left = position.left;
            style.top = position.top;
        }

        const selection = this.props.editorState.getSelection();
        if( selection.getHasFocus() && !selection.isCollapsed() ) {
            style.visibility = 'visible';
        }
        else {
            style.visibility = 'hidden';
        }
        return style;
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