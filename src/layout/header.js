import React, {Component} from 'react';
import '../App.css';

class Header extends Component {
    render() {
        return (
            <header className="App-header">
                <div className="App">
                    <a href="/">
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" className="" alt="logo"
                             style={{maxWidth: '100%', maxHeight: '50px'}}/>
                    </a>
                    <h1 className="App-title">Welcome to Buzzbuzz English Corner</h1>
                </div>
            </header>
        );
    }
}

export default Header;
