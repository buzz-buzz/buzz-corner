import React, {Component} from 'react';
import {Link} from 'react-router';

class Homepage extends Component {
    render() {
        return (
            <div className="homepage">
                <br/>
                <br/>
                <br/>
                <Link to="/login" key="login" history="/login" className="ui green button">
                    Login
                </Link>
                <br/>
                <Link to='/profile' key='profile' history="/profile">
                    <button className="ui green button" style={{margin: '1em 0'}}>profile setup</button>
                </Link>
                <br/>
                <Link to='/profile/avatar' className="ui green button"  key='avatar' history="/profile/avatar">
                    avatar setup
                </Link>
                <br/>
            </div>
        );
    }
}

export default Homepage;
