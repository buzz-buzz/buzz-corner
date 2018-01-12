import React, {Component} from 'react';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" className="" alt="logo"
                         style={{maxWidth: '100%', maxHeight: '50px'}}/>
                    <h1 className="App-title">Welcome to Buzzbuzz English Corner</h1>
                </header>
                <br/>
                <br/>
                <br/>
                <br/>
                <a className="ui green button" href="//corner.buzzbuzzenglish.com/wechat-login">微信登录</a>
                <br/>
                <a className="ui green button" href="/profile" style={{margin: '1em 0'}}>profile setup</a>
            </div>
        );
    }
}

export default App;
