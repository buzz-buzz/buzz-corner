import React, {Component} from 'react';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <br/>
                <br/>
                <br/>
                <br/>
                <a className="ui green button"
                   href={`//corner.buzzbuzzenglish.com/wechat-login?sign_in_origin=${btoa(window.location.href)}`}>weChat login</a>
                <br/>
                <a className="ui green button" href="/profile" style={{margin: '1em 0'}}>profile setup</a>
            </div>
        );
    }
}

export default App;
