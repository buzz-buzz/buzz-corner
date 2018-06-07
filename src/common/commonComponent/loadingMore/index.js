import React, {Component} from 'react';
import './index.css';

class LoadingMore extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="loading-more" style={this.props.loadingMore ? {} : {display: 'none'} }>
                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_information%20cue.svg" alt=""/>
            </div>
        );
    }
}

export default LoadingMore;