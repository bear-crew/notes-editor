import { EditorState, getVisibleSelectionRect, RichUtils } from 'draft-js';
import * as React from 'react';
import './Toolbar.css';

class Toolbar extends React.Component<any, any> {
    public static getDerivedStateFromProps(nextProps: any, prevState: any) { // TODO: fix types
        const selection = nextProps.editorState.getSelection();
        const nextState = {
            linkInputIsOpen: prevState.linkInputIsOpen,
            pictureInputIsOpen: prevState.pictureInputIsOpen,
            prevSelection: prevState.prevSelection,
            sidebarIsOpen: false,
            toolbarIsOpen: false,
            visibleSelection: prevState.visibleSelection,
        };
        if(( selection !== prevState.prevSelection || selection.isCollapsed()) && prevState.linkInputIsOpen && selection.getHasFocus()) {
            nextState.linkInputIsOpen = false;
        }

        if (selection.getHasFocus() && !selection.isCollapsed() && !prevState.linkInputIsOpen && !prevState.pictureInputIsOpen) { // open toolbar
            nextState.toolbarIsOpen = true;
        } 
        else {
            nextState.toolbarIsOpen = false;
        }

        if (selection.getHasFocus() || nextState.pictureInputIsOpen) { // open sidebar
            nextState.sidebarIsOpen = true;
        }
        else {
            nextState.sidebarIsOpen = false;
        }

        return nextState;
    }

    constructor(props: any) {
        super(props);
        this.state = {
            linkInputIsOpen: false,
            pictureInputIsOpen: false,
            prevSelection: {},
            sidebarIsOpen: false,
            toolbarIsOpen: false,
            visibleSelection: null
        };
    }

    public componentDidUpdate() { // TODO: disassembly to functions 
        if (this.state.toolbarIsOpen) { // don't open toolbar when link input is open
            this.setToolbarPosition();
        }

        if (this.state.linkInputIsOpen) {
            this.setLinkInputPosition();
        }

        if (this.state.sidebarIsOpen) {
            this.setSidebarPosition();
        }

    }

    public render() {
        const toolbarStyle = {
            left: 0,
            position: 'absolute',
            top: 0
        } as React.CSSProperties;

        const sidebarStyle = {
            left: 30,
            top: 0
        } as React.CSSProperties;

        const linkInputStyle = {
            left: 0,
            position: 'absolute',
            top: 0
        } as React.CSSProperties;

        return [
            this.state.toolbarIsOpen && <div className="toolbar" key="toolbar" style={toolbarStyle}>
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
            
            this.state.linkInputIsOpen && <div className="link-input-wrapper" key="link-input" style={linkInputStyle} >
                <input placeholder="Type your link here..." type="url" className="link-input" name="" id="link-input" onInput={this.urlInput} />
                <button type='button' className='post-link' />
                <div className="gradient" />
            </div>,

            this.state.sidebarIsOpen && <div className="sidebar" key="sidebar" style={sidebarStyle} id='sidebar'>
                <button type="button" className="picture" onMouseDown={this.picture} />
            </div>,

            this.state.pictureInputIsOpen && <input type="url" name="" key="picture-input" id="picture-input" onInput={this.urlInput} />
        ];
    }

    private setPictureInput = (sidebar : HTMLElement) => {
        const pictureInput = document.getElementById('picture-input');
        if(pictureInput && sidebar && sidebar.style.top) {
            const top = Number(sidebar.style.top.slice(0,-2))+30; 
            pictureInput.style.top = `${top}px`;
            pictureInput.style.left = sidebar.style.left;
        }
    }

    private setSidebarPosition = () => {
        const sidebarStyle = this.getSidebarPosition();
        const sidebarNode = document.getElementById('sidebar');
        if(sidebarNode) {
            if(this.state.pictureInputIsOpen) {
                this.setPictureInput(sidebarNode);
            }
            sidebarNode.style.top = `${sidebarStyle.top}px`;
        }
        


    }

    private setLinkInputPosition = () => {
        const linkInputNodes = document.getElementsByClassName('link-input-wrapper') as HTMLCollectionOf<HTMLElement>;
        const [style, className] = this.getStyle('link-bubble', 55, 255, this.state.visibleSelection);
        linkInputNodes[0].style.top = `${style.top}px`;
        linkInputNodes[0].style.left = `${style.left}px`;

        if (className === '') {
            linkInputNodes[0].className = 'link-input-wrapper';
        }
        else if (className === 'link-bubble-bottom-r') {
            linkInputNodes[0].className = 'link-input-wrapper link-bubble-bottom-r';
        }
        else if (className === 'link-bubble-bottom-l') {
            linkInputNodes[0].className = 'link-input-wrapper link-bubble-bottom-l';
        }
        else if (className === 'link-bubble-top') {
            linkInputNodes[0].className = 'link-input-wrapper link-bubble-top';
        }
        else if (className === 'link-bubble-top-r') {
            linkInputNodes[0].className = 'link-input-wrapper link-bubble-top-r';
        }
        else if (className === 'link-bubble-top-l') {
            linkInputNodes[0].className = 'link-input-wrapper link-bubble-top-l';
        }
    } 

    private setToolbarPosition = () => {
        const toolbarNodes = document.getElementsByClassName('toolbar') as HTMLCollectionOf<HTMLElement>;
        const [style, className] = this.getStyle('bubble', 115, 193, getVisibleSelectionRect(window));
        toolbarNodes[0].style.top = `${style.top}px`;
        toolbarNodes[0].style.left = `${style.left}px`;

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

    private getSidebarPosition = () => {
        let style = {} as React.CSSProperties;
        let selection;

        if (this.state.pictureInputIsOpen) {
            selection = this.state.prevSelection;
        }
        else {
            selection = this.props.editorState.getSelection();
        }
        
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
                top: y - 5
            } 
            return style;
        }
        else {
            style = {
                top: 0
            }
            return style;
        }
    }

    private getStyle = (key: string, height: number, width: number, selectRect: ClientRect): [React.CSSProperties, string] => {
        const style = {
            left: 0,
            position: 'absolute',
            top: 0
        } as React.CSSProperties;
        let className = '';

        const editorElement = document.getElementsByClassName('DraftEditor-root')[0];

        if (!editorElement) {
            return [style, className];
        }

        const editorRect = editorElement.getBoundingClientRect();
        // const selectRect = getVisibleSelectionRect(window);
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
        
        return [style, className];
    }

    private urlInput = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault();
        // this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD'));
    }

    private picture = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (this.state.pictureInputIsOpen) {
            // bring back selection
            this.props.onChange(EditorState.forceSelection(this.props.editorState, this.state.prevSelection));
        }

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
        const temp = getVisibleSelectionRect(window);
        this.setState({
            linkInputIsOpen: true,
            prevSelection: this.props.editorState.getSelection(),
            toolbarIsOpen: false,
            visibleSelection: temp
        });
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