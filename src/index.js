import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactEditor from './Editor';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ReactEditor />, document.getElementById('root'));

serviceWorker.unregister();
