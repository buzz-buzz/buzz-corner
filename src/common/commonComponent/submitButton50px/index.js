import * as React from "react";
import './index.css';

export default class Button extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pressing: false
        };

        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
    }

    touchStart(){
        this.setState({
            pressing: true
        });
    }

    touchEnd(){
        this.setState({
            pressing: false
        });
    }

    render() {
        return (
            <div className="submit-button" onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
                <button onClick={this.props.submit} disabled={this.props.disabled} style={ this.props.disabled === true ? {background: '#dfdfe4'} : {background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))'}}>
                    {this.props.text || 'Continue'}
                </button>
            </div>
        )
    }
}