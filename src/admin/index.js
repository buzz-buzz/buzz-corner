import React, {Component} from 'react';
import {Link} from 'react-router';
import './index.css';
import Resources from '../resources';

class adminManage extends Component {
    render() {
        return (
            <div className="manage-home">
                <br/>
                <br/>
                <br/>
                <Link to='/admin/class' className="ui wihte button"  key='profile' history="/admin/class">
                    {Resources.getInstance().adminManageClass}
                </Link>
                <br/>
                <br/>
            </div>
        );
    }
}

export default adminManage;