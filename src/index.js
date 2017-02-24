import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {muiThemeStyle} from './styles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const ThemedApp = () => {
    const muiTheme = getMuiTheme(muiThemeStyle);
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
            <App />
        </MuiThemeProvider>
    )
}

ReactDOM.render(<ThemedApp />,document.getElementById('root'));
