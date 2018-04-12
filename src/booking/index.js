import React, {Component} from 'react';
import Track from "../common/track";
import '../common/Icon/style.css';
import './index.css';

class Booking extends Component {
    constructor() {
        super();

        this.back = this.back.bind(this);
    }

    back() {
        Track.event('预约_预约页面返回');

        window.history.back();
    }

    componentDidMount() {
        Track.event('预约_预约页面展示');
    }

    render() {
        return (
            <div className="booking-page">
                <i className="icon-icon_back_up" />
            </div>
        );
    }
}

export default Booking;