import React, {Component} from 'react';
import {Link} from 'react-router';
import Resources from '../resources';

class Homepage extends Component {
    render() {
        return (
            <div className="homepage">
                <br/>
                <br/>
                <br/>
                <Link to="/login" key="login" history="/login" className="ui green button">
                    {Resources.getInstance().homeLogin}
                </Link>
                <br/>
                <Link to='/profile' key='profile' history="/profile">
                    <button className="ui green button" style={{margin: '1em 0'}}>{Resources.getInstance().homeProfile}</button>
                </Link>
                <br/>
                <Link to='/profile/avatar' className="ui green button"  key='avatar' history="/profile/avatar">
                    {Resources.getInstance().homeAvatar}
                </Link>
                <br/>
            </div>
        );
    }
}

export default Homepage;
