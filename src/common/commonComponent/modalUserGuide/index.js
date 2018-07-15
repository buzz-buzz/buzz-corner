import React from 'react';
import Back from '../../back';
import './index.css';

export default class UserGuide extends React.Component{
    constructor(){
        super();

        this.state = {
            step: 0,
            steps: [
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-01.jpg",
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-02.jpg",
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-03.jpg",
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-04.jpg",
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-05.jpg",
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-06.jpg",
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-07.jpg",
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-08.jpg",
                "https://cdn-corner.resource.buzzbuzzenglish.com/user-guide/inland-guidance-09.jpg",
            ],
            end: false
        };

        this.nextStep = this.nextStep.bind(this);
    }

    nextStep(){
        let newStep = this.state.step + 1;

        if( newStep <= 8 ){
            this.setState({
                step: newStep
            });
        }else{
            this.setState({end: true}, () => {
                if(this.props.back) Back.back();
            });
        }
    }
    
    render(){
        return (
            <div className="user-guide" onClick={this.nextStep}
                 style={ this.props.modal && !this.state.end ? {} : {display: 'none'}}>
                <img src={this.state.steps[this.state.step]} alt="Loading..."/>
            </div>
        )
    }
}