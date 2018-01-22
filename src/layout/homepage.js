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
                <Link to='/my' className="ui green button"   style={{margin: '1em 0'}} key='my' >
                    {Resources.getInstance().my}
                </Link>
                <br/>
            </div>
        );
    }
}

export default Homepage;
