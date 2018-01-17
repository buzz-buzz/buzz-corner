import React, {Component} from 'react';
import { Link } from 'react-router';

class Homepage extends Component {
    render() {
        return (
            <div className="homepage">
                <br/>
                <br/>
                <br/>
                <a className="ui green button"
                   href={`//corner.buzzbuzzenglish.com/wechat-login?sign_in_origin=${btoa(window.location.href)}`}>weChat login
                </a>
                <br/>
                <Link to='/profile' key='profile' history="/profile">
                    <button className="ui green button" style={{margin: '1em 0'}}>profile setup</button>
                </Link>
                <br/>
                <br/>
            </div>
        );
    }
}

export default Homepage;
