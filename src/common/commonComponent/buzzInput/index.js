import * as React from "react";
import './index.css';

export default class BuzzInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pressing: false
        };
    }

    render() {
        return (
            <div className="buzz-input"
                 style={{height: this.props.height || '50px', width: this.props.width || '100%'}}>
                <input type={ this.props.type || "text"}  placeholder={this.props.placeholder}
                       value={this.props.value} disabled={this.props.disabled}
                       onChange={this.props.onChange}
                       name={this.props.name}/>
            </div>
        )
    }
}