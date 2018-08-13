import * as React from "react";
import './index.css';

export default class Button extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pressing: false,
        };

        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
    }

    touchStart(){
        if(!this.props.disabled){
            this.setState({
                pressing: true
            });
        }
    }

    touchEnd(){
        if(!this.props.disabled){
            this.setState({
                pressing: false
            });
        }
    }

    render() {
        return (
            <div className="submit-button">
                <button className={this.state.pressing ? 'pressing' : ''}
                        onClick={this.props.submit} onTouchStart={this.touchStart}
                        onTouchEnd={this.touchEnd} disabled={this.props.disabled}
                        style={ this.props.style ?
                            this.props.style : (this.props.disabled ? {background: '#dfdfe4'} : {background: '#ffd200', boxShadow: '0 2px 5px 0 rgba(237, 174, 0, 0.4)'})}>
                    {this.props.text || 'Continue'}
                </button>
            </div>
        )
    }
}