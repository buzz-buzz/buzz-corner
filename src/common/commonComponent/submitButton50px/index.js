import * as React from "react";
import './index.css';

export default class Button extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
<<<<<<< HEAD
            pressing: false,
=======
            pressing: false
>>>>>>> master
        };

        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
    }

    touchStart(){
<<<<<<< HEAD
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
=======
        this.setState({
            pressing: true
        });
    }

    touchEnd(){
        this.setState({
            pressing: false
        });
>>>>>>> master
    }

    render() {
        return (
<<<<<<< HEAD
            <div className="submit-button">
                <button className={this.state.pressing ? 'pressing' : ''}
                        onClick={this.props.submit} onTouchStart={this.touchStart}
                        onTouchEnd={this.touchEnd} disabled={this.props.disabled}
                        style={ this.props.disabled ? {background: '#dfdfe4'} : {background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))'}}>
=======
            <div className="submit-button" onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}>
                <button onClick={this.props.submit} disabled={this.props.disabled} style={ this.props.disabled === true ? {background: '#dfdfe4'} : {background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))'}}>
>>>>>>> master
                    {this.props.text || 'Continue'}
                </button>
            </div>
        )
    }
}