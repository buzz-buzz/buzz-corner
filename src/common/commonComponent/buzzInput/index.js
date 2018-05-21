import * as React from "react";
import './index.css';

export default class BuzzInput extends React.Component {
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
            <div className={ this.state.pressing ? "buzz-input pressing" : "buzz-input"}
                 style={{height: this.props.height || '50px', width: this.props.width || '100%'}}
                 onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}
            >
                <input type={ this.props.type || "text"}  placeholder={this.props.placeholder}
                       value={this.props.value} disabled={this.props.disabled}
                       onChange={this.props.onChange}
                       name={this.props.name} />
            </div>
        )
    }
}