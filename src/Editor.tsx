import { CompositeDecorator,ContentBlock, ContentState, EditorState } from 'draft-js';
import createImagePlugin from 'draft-js-image-plugin';
import Editor from 'draft-js-plugins-editor';
import * as React from 'react';
import './Editor.css';
import Toolbar from './Toolbar/Toolbar';
const imagePlugin = createImagePlugin();


interface ILinkProps {
    contentState : ContentState,
    entityKey : string,
    children : any
}

class ReactEditor extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        const decorator = new CompositeDecorator([
            {
                component: Link,
                strategy: findLinkEntities
              
            }
        ]);
        this.state = {
            editorState: EditorState.createEmpty(decorator)
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

function findLinkEntities(contentBlock : ContentBlock, callback : any, contentState : ContentState) {
    console.log("decorator Function");
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  }

const Link = (props : ILinkProps) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
      <a href={url} className='link'>
        {props.children}
      </a>
    );
  };

export default ReactEditor;