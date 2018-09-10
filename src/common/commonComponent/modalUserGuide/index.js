import React from 'react';
import Back from '../../back';
import Client from "../../../common/client";
import './index.css';

const tabletStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

export default class UserGuide extends React.Component {
    constructor() {
        super();

        this.state = {
            step: 0,
            steps: [
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-01.png",
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-02.png",
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-03.png",
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-04.png",
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-05.png",
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-06.png",
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-07.png",
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-08.png",
                "//cdn-corner.resource.buzzbuzzenglish.com/user-guide-09.png",
            ],
            end: false
        };

        this.nextStep = this.nextStep.bind(this);
    }

    nextStep() {
        let newStep = this.state.step + 1;

        if (newStep <= 8) {
            this.setState({
                step: newStep
            });
        } else {
            this.setState({end: true}, () => {
                if (this.props.back) Back.back();
            });
        }
    }

    render() {
        return (
            <div className="user-guide" onClick={this.nextStep}
                 style={ this.props.modal && !this.state.end ?
                     ( Client.getClient() === 'phone' ? {} : tabletStyle) : {display: 'none'}}>
                <img src={this.state.steps[this.state.step]} alt="Loading..."/>
            </div>
        )
    }
}