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
            }, () => {
                this.props.submit();
            });
        }
    }

    render() {
        return (
            <div className="submit-button">
                <button className={this.state.pressing ? 'pressing' : ''}
                        onTouchStart={this.touchStart}
                        onTouchEnd={this.touchEnd} disabled={this.props.disabled}
                        style={ this.props.disabled ? {background: '#dfdfe4'} : {background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))'}}>
                    {this.props.text || 'Continue'}
                </button>
            </div>
        )
    }
}