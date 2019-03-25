import { getVisibleSelectionRect, RichUtils } from 'draft-js';
import * as React from 'react';
import './Toolbar.css';

class Toolbar extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            linkInputIsOpen: false,
            pictureInputIsOpen: false,
            prevSelection: {}
        };
    }

    public componentDidUpdate() { // TODO: disassembly to functions 
        const toolbarNodes = document.getElementsByClassName('toolbar') as HTMLCollectionOf<HTMLElement>;
        
        // console.log(this.state.linkInputIsOpen);
        if (this.state.linkInputIsOpen) { // don't open toolbar when link input is open
            toolbarNodes[0].style.visibility = 'hidden';
            // console.log("eat ass");
        }
        else {
            const [style, className] = this.getStyle('bubble', 115, 193);
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

        console.log(this.state.linkInputIsOpen, !this.props.editorState.getSelection().isCollapsed());
        
        if (false) { // if user changed selection when link input is open -> close link input
            this.setState({linkInputIsOpen: false});
        }

        const sidebarStyle = this.getSidebarPosition();
        const sidebarNodes = document.getElementsByClassName('sidebar') as HTMLCollectionOf<HTMLElement>;
        sidebarNodes[0].style.top = `${sidebarStyle.top}px`;
        sidebarNodes[0].style.visibility = `${sidebarStyle.visibility}`;
    }

    public render() {
        const toolbarStyle = {
            left: 0,
            position: 'absolute',
            top: 0,
            visibility: 'hidden'
        } as React.CSSProperties;

        const sidebarStyle = {
            left: 30,
            top: 0,
            visibility: 'hidden'
        } as React.CSSProperties;

        const linkInputStyle = {
            left: 0,
            position: 'absolute',
            top: 0,
            visibility: 'hidden'
        } as React.CSSProperties;


        const urlInput = this.state.pictureInputIsOpen && <input type="url" name="" id="picture-input" onInput={this.urlInput} />

        return [
            <div className="toolbar" key="toolbar" style={toolbarStyle}>
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
                    <button type="button" className='link' onMouseDown={this.link}/>
                </div>
            </div>,
            
            <div className="link-input" key="link-input" style={linkInputStyle} >
                <input type="url" name="" id="link-input" onInput={this.urlInput} />
            </div>,

            <div className="sidebar" key="sidebar" style={sidebarStyle}>
                <button type="button" className="picture" onMouseDown={this.picture} />
                {urlInput}
            </div>
        ];
    }

    private getSidebarPosition = () => {
        let style = {} as React.CSSProperties
        const selection = this.props.editorState.getSelection();
        const nodes = document.querySelectorAll(`[data-offset-key="${selection.anchorKey}-0-0"]`);

        if (selection.getHasFocus()) {
            const editorElement = document.getElementsByClassName('DraftEditor-root')[0];
            const editrorRect = editorElement.getBoundingClientRect();
            const node = nodes[2] as Element;
            let y = node.getBoundingClientRect().top - editrorRect.top;
            if (nodes[0].nodeName === 'H2' || nodes[0].nodeName === 'H3') {
                y += 5;
            } 
            style = {
                top: y - 5,
                visibility: 'visible'
            } 
            return style;
        }
        else {
            style = {
                top: 0,
                visibility: 'hidden'
            }
            return style;
        }
    }

    private getStyle = (key: string, height: number, width: number): [React.CSSProperties, string] => {
        const style = {
            left: 0,
            position: 'absolute',
            top: 0,
            visibility: 'hidden'
        } as React.CSSProperties;
        let className = '';
        const selection = this.props.editorState.getSelection();

        if (!selection.getHasFocus() || selection.isCollapsed()) {
            return [style, className];
        }

        const editorElement = document.getElementsByClassName('DraftEditor-root')[0];

        if (!editorElement) {
            return [style, className];
        }

        const editorRect = editorElement.getBoundingClientRect();
        const selectRect = getVisibleSelectionRect(window);
        let position;
        const extraOffset = 5;
        const horizontalOffset = 26;

        if (selectRect) {
            position = {
                left: selectRect.left - width/2 + selectRect.width/2 - editorRect.left,
                top: selectRect.bottom + extraOffset - editorRect.top
            };

            if (position.left + width + editorRect.left > editorRect.right) { // toolbar moves right too much
                if (editorRect.top + position.top + height > editorRect.bottom) { // right and down
                    position.top = selectRect.top - height - editorRect.top;
                    className = key+'-top-r';
                }
                else {
                    className = key+'-bottom-r';
                }
                position.left = (selectRect.right - selectRect.width/2) - (width - horizontalOffset) - editorRect.left;
            } 
            
            else if (position.left < 0) { // toolbar moves left too much
                if (editorRect.top + position.top + height > editorRect.bottom) { // left and down
                    position.top = selectRect.top - height - editorRect.top;
                    className = key+'-top-l';
                }
                else {
                    className = key+'-bottom-l';
                }
                position.left = (selectRect.left + selectRect.width/2 - horizontalOffset) - editorRect.left;
            } 
            
            else if (editorRect.top + position.top + height > editorRect.bottom) { // toolbar moves down too much
                position.top = selectRect.top - height - editorRect.top;
                className = key+'-top';
            }
            style.left = position.left;
            style.top = position.top;
        }
        
        style.visibility = 'visible';
        return [style, className];
    }

    private urlInput = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        // this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD'));
    }

    private picture = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.setState({prevSelection: this.props.editorState.getSelection()});
        this.setState({pictureInputIsOpen: !this.state.pictureInputIsOpen});
        // this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD'));
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

    private link = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        this.setState({linkInputIsOpen: true});

        const toolbarNodes = document.getElementsByClassName('toolbar') as HTMLCollectionOf<HTMLElement>;
        toolbarNodes[0].style.visibility = 'hidden';

        const linkInputNodes = document.getElementsByClassName('link-input') as HTMLCollectionOf<HTMLElement>;
        const [style, className] = this.getStyle('link-bubble', 55, 255);
        linkInputNodes[0].style.top = `${style.top}px`;
        linkInputNodes[0].style.left = `${style.left}px`;
        linkInputNodes[0].style.visibility = `${style.visibility}`;

        if (className === '') {
            linkInputNodes[0].className = 'link-input';
        }
        else if (className === 'link-bubble-bottom-r') {
            linkInputNodes[0].className = 'link-input link-bubble-bottom-r';
        }
        else if (className === 'link-bubble-bottom-l') {
            linkInputNodes[0].className = 'link-input link-bubble-bottom-l';
        }
        else if (className === 'link-bubble-top') {
            linkInputNodes[0].className = 'link-input link-bubble-top';
        }
        else if (className === 'link-bubble-top-r') {
            linkInputNodes[0].className = 'link-input link-bubble-top-r';
        }
        else if (className === 'link-bubble-top-l') {
            linkInputNodes[0].className = 'link-input link-bubble-top-l';
        }
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