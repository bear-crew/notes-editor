import { AtomicBlockUtils, EditorState, getVisibleSelectionRect, RichUtils, SelectionState } from 'draft-js';
import * as React from 'react';
import './Toolbar.css';

interface IProps {
    editorState: EditorState;
    onChange: (editorState: EditorState) => void;
};

interface IState {
    linkInput: string;
    linkInputIsOpen: boolean;
    pictureInput: string;
    pictureInputIsOpen: boolean;
    prevSelection: SelectionState;
    sidebarIsOpen: boolean;
    toolbarIsOpen: boolean;
    visibleSelection: ClientRect;
};

class Toolbar extends React.Component<IProps, IState> {
    public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        const selection = nextProps.editorState.getSelection();
        const nextState = {
            linkInputIsOpen: prevState.linkInputIsOpen,
            pictureInputIsOpen: prevState.pictureInputIsOpen,
            prevSelection: prevState.prevSelection,
            sidebarIsOpen: false,
            toolbarIsOpen: false,
            visibleSelection: prevState.visibleSelection
        };

        if ((selection !== prevState.prevSelection || selection.isCollapsed()) && prevState.linkInputIsOpen && selection.getHasFocus() || nextState.pictureInputIsOpen) {
            nextState.linkInputIsOpen = false;
        }

        if (selection.getHasFocus() && !selection.isCollapsed() && !nextState.linkInputIsOpen && !prevState.pictureInputIsOpen) { // open toolbar
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

    private toolbarRef = React.createRef<HTMLDivElement>();
    private linkInputRef = React.createRef<HTMLDivElement>();
    private pictureInputRef = React.createRef<HTMLDivElement>();
    private sidebarRef = React.createRef<HTMLDivElement>();

    constructor(props: IProps) {
        super(props);
        this.state = {
            linkInput: "",
            linkInputIsOpen: false,
            pictureInput: "",
            pictureInputIsOpen: false,
            prevSelection: new SelectionState,
            sidebarIsOpen: false,
            toolbarIsOpen: false,
            visibleSelection: getVisibleSelectionRect(window)
        };

        this.getButtonStyle = this.getButtonStyle.bind(this);
        this.postLink = this.postLink.bind(this);
        this.insertImage = this.insertImage.bind(this);
        this.setSidebarPosition = this.setSidebarPosition.bind(this);
        this.setLinkInputPosition = this.setLinkInputPosition.bind(this);
        this.setToolbarPosition = this.setToolbarPosition.bind(this);
        this.getSidebarPosition = this.getSidebarPosition.bind(this);
        this.getStyle = this.getStyle.bind(this);   
    }

    public componentDidUpdate() {
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
            left: 20, // leftPadding/2 - buttonWidth/2 
            top: 0
        } as React.CSSProperties;

        const linkInputStyle = {
            left: 0,
            position: 'absolute',
            top: 0
        } as React.CSSProperties;

        const pictureInputStyle = {
            left: 0,
            position: 'absolute',
            top: 0
        } as React.CSSProperties;

        return [
            this.state.toolbarIsOpen && <div ref={this.toolbarRef} className="toolbar" key="toolbar" style={toolbarStyle}>
                <div className="toolbar-column">
                    <button type="button" className={this.getButtonStyle('bold')} onMouseDown={this.bold} />
                    <button type="button" className={this.getButtonStyle('ordered-list')} onMouseDown={this.ordList} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className={this.getButtonStyle('italic')} onMouseDown={this.italic} />
                    <button type="button" className={this.getButtonStyle('unordered-list')} onMouseDown={this.unordList} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className={this.getButtonStyle('h2')} onMouseDown={this.h2} />
                    <button type="button" className={this.getButtonStyle('blockquote')} onMouseDown={this.blockquote} />
                </div>
                <div className="toolbar-column">
                    <button type="button" className={this.getButtonStyle('h3')} onMouseDown={this.h3} />
                    <button type="button" className='link' onMouseDown={this.link}/>
                </div>
            </div>,
            
            this.state.linkInputIsOpen && <div ref={this.linkInputRef} className="link-input-wrapper" key="link-input" style={linkInputStyle} >
                <input placeholder="Type your link here..." type="url" className="link-input" name="" id="link-input" onInput={this.urlLink} />
                <button type='button' className='post-link' onClick={this.postLink}/>
                <div className="gradient" />
            </div>,

            this.state.sidebarIsOpen && <div ref={this.sidebarRef} className="sidebar" key="sidebar" style={sidebarStyle} id='sidebar'>
                <button type="button" className={this.state.pictureInputIsOpen ? "picture picture-pushed" : "picture"} onMouseDown={this.picture} />
            </div>,

            this.state.pictureInputIsOpen && <div ref={this.pictureInputRef} className="picture-input-wrapper" key="picture-input" style={pictureInputStyle}>
                <input type="url" name="picture-input" className="picture-input" onInput={this.urlPicture} />
                <button type='button' onClick={this.insertImage} className='picture-accept' />
                <div className="gradient move-right" />
            </div>
        ];
    }

    private getButtonStyle(buttonType : string) : string {
        const currentInlineStyle = this.props.editorState.getCurrentInlineStyle();
        const selection = this.props.editorState.getSelection();
        const currentBlockStyle = this.props.editorState
                .getCurrentContent()
                .getBlockForKey(selection.getStartKey())
                .getType();
        switch (buttonType) {
            case 'bold': {
                if (currentInlineStyle.has('BOLD')) {
                    return 'bold bold-active';
                }
                else {
                    return 'bold';
                } 
            }
            case 'italic': {
                if (currentInlineStyle.has('ITALIC')) {
                    return 'italic italic-active';
                }
                else {
                    return 'italic';
                } 
            }
            case 'h2': {
                if (currentBlockStyle === 'header-two') {
                    return 'h2 h2-active';
                }
                else {
                    return 'h2';
                }
            }
            case 'h3': {
                if (currentBlockStyle === 'header-three') {
                    return 'h3 h3-active';
                }
                else {
                    return 'h3';
                }
            }
            case 'blockquote': {
                if (currentBlockStyle === 'blockquote') {
                    return 'blockquote blockquote-active';
                }
                else {
                    return 'blockquote';
                }
            }
            case 'ordered-list': {
                if (currentBlockStyle === 'ordered-list-item') {
                    return 'ordered-list ordered-list-active';
                }
                else {
                    return 'ordered-list';
                }
            }
            case 'unordered-list': {
                if (currentBlockStyle === 'unordered-list-item') {
                    return 'unordered-list unordered-list-active';
                }
                else {
                    return 'unordered-list';
                }
            }
            default: return buttonType;
        }
    }

    private postLink(e : React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const linkUrl = this.state.linkInput;
        const editorState = this.props.editorState;
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            { url: linkUrl }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
        this.props.onChange( RichUtils.toggleLink(
                newEditorState,
                newEditorState.getSelection(),
                entityKey
            )
        );
    }

    private insertImage() {
        const linkUrl = this.state.pictureInput;
        if (linkUrl) {
            const contentState = this.props.editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(
                'image',
                'IMMUTABLE',
                { src:linkUrl },
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = EditorState.set(
                this.props.editorState,
                { currentContent: contentStateWithEntity },
            );
    
            this.props.onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
            this.setState({
                pictureInput: '',
                pictureInputIsOpen: false
            });
        }
    };

    private setPictureInput(sidebar: HTMLElement) {
        const pictureInput = this.pictureInputRef.current;
        const cornerOffset = {
            left: 12, // to adjust corner in right position
            top: 54 // height of bubble + 10
        };

        if (pictureInput && sidebar && sidebar.style.top && sidebar.style.left) {
            pictureInput.style.top = `${parseFloat(sidebar.style.top) + cornerOffset.top}px`;
            pictureInput.style.left = `${parseFloat(sidebar.style.left) - cornerOffset.left}px`;
        }
    }

    private setSidebarPosition() {
        const sidebarStyle = this.getSidebarPosition();
        const sidebarNode = this.sidebarRef.current;
        if(sidebarNode) {
            if(this.state.pictureInputIsOpen) {
                this.setPictureInput(sidebarNode);
            }
            sidebarNode.style.top = `${sidebarStyle.top}px`;
        }
    }

    private setLinkInputPosition() {
        const linkInput = this.linkInputRef.current;
        const [style, className] = this.getStyle('link-bubble', 63, 263, this.state.visibleSelection);

        if (linkInput) {
            linkInput.style.top = `${style.top}px`;
            linkInput.style.left = `${style.left}px`;
            linkInput.className = 'link-input-wrapper ' + className;
        }
    } 

    private setToolbarPosition() {
        const toolbar = this.toolbarRef.current;
        const [style, className] = this.getStyle('bubble', 115, 193, getVisibleSelectionRect(window));

        if (toolbar) {
            toolbar.style.top = `${style.top}px`;
            toolbar.style.left = `${style.left}px`;
            toolbar.className = 'toolbar ' + className;
        }
    }

    private getSidebarPosition() {
        let style = {} as React.CSSProperties;
        let selection;

        if (this.state.pictureInputIsOpen) {
            selection = this.state.prevSelection;
        }
        else {
            selection = this.props.editorState.getSelection();
        }
        
        const node = document.querySelector(`[data-offset-key="${selection.getAnchorKey()}-0-0"]`);
        if (selection.getHasFocus()) {
            const editorElement = document.getElementsByClassName('DraftEditor-root')[0];
            const editrorRect = editorElement.getBoundingClientRect();
            const parentNode = node as Element;
            const buttonHeight = 42;
            const blockHeight = parentNode.getBoundingClientRect().height;
            const y = parentNode.getBoundingClientRect().top - editrorRect.top - (buttonHeight - blockHeight)/2;
            style = {
                top: y
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

    private getStyle(key: string, height: number, width: number, selectRect: ClientRect): [React.CSSProperties, string] {
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
                    className = key + '-top-r';
                }
                else {
                    className = key + '-bottom-r';
                }
                position.left = (selectRect.right - selectRect.width/2) - (width - horizontalOffset) - editorRect.left;
            } 
            
            else if (position.left < 0) { // toolbar moves left too much
                if (editorRect.top + position.top + height > editorRect.bottom) { // left and down
                    position.top = selectRect.top - height - editorRect.top;
                    className = key + '-top-l';
                }
                else {
                    className = key + '-bottom-l';
                }
                position.left = (selectRect.left + selectRect.width/2 - horizontalOffset) - editorRect.left;
            } 
            
            else if (editorRect.top + position.top + height > editorRect.bottom) { // toolbar moves down too much
                position.top = selectRect.top - height - editorRect.top;
                className = key + '-top';
            }
            style.left = position.left;
            style.top = position.top;
        }
        
        return [style, className];
    }

    private urlLink = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({linkInput: event.currentTarget.value});
    }

    private urlPicture = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({pictureInput: event.currentTarget.value});
    }

    private picture = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (this.state.pictureInputIsOpen) {
            this.props.onChange(EditorState.forceSelection(this.props.editorState, this.state.prevSelection)); // bring back selection
        }

        this.setState({prevSelection: this.props.editorState.getSelection()});
        this.setState({pictureInputIsOpen: !this.state.pictureInputIsOpen});
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