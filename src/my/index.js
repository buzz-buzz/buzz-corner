import React, {Component} from 'react';
import {Link} from 'react-router';
import Resources from '../resources';
import './my.css';

class Homepage extends Component {
    render() {
        return (
            <div className="my-profile">
                <br/>
                <br/>
                <br/>
                <Link to='/my/profile' className="ui wihte button"  key='profile' history="/my/profile">
                   {Resources.getInstance().homeProfile}
                </Link>
                <br/>
                <Link to='/my/profile/avatar' className="ui white button"  key='avatar' history="/my/profile/avatar">
                    {Resources.getInstance().homeAvatar}
                </Link>
                <br/>
                <Link to='/my/profile/language' className="ui white button"  key='language' history="/my/profile/language" >
                    {Resources.getInstance().toggleLanguage}
                </Link>
                <br/>
            </div>
        );
    }
}

export default Homepage;