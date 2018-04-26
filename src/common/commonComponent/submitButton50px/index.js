import * as React from "react";
import './index.css';

export default class Button extends React.Component {
    render() {
        return (
            <div className="submit-button">
                <button onClick={this.props.submit} disabled={this.props.disabled} style={ this.props.disabled === true ? {background: '#dfdfe4'} : {background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))'}}>
                    {this.props.text || 'Continue'}
                </button>
            </div>
        )
    }
}