import React from 'react';
import './progress.css';

export default class Progress extends React.Component {
    render() {
        return <div className="progress">
            <div className="short-line" style={{background: '#ffd200'}}></div>
            <div className="num">
                <img src="//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_1_active.svg" alt=""/>
            </div>
            <div className="long-line" style={ this.props.step >= 2 ? {background: '#ffd200'} : {background: '#dfdfe4'}}></div>
            <div className="num">
                <img src={ this.props.step >= 2 ? "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_2_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_2.svg"} alt=""/>
            </div>
            <div className="long-line" style={this.props.step >= 3 ? {background: '#ffd200'} : {background: '#dfdfe4'}}></div>
            <div className="num">
                <img src={ this.props.step >= 3 ? "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_3_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_3.svg"} alt=""/>
            </div>
            <div className="long-line" style={this.props.step >= 4 ? {background: '#ffd200'} : {background: '#dfdfe4'}}></div>
            <div className="num">
                <img src={ this.props.step >= 4 ? "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_4_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_4.svg"} alt=""/>
            </div>
            <div className="long-line" style={this.props.step >= 5 ? {background: '#ffd200'} : {background: '#dfdfe4'}}></div>
            <div className="num">
                <img src={ this.props.step >= 5 ? "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_5_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_5.svg"} alt=""/>
            </div>
            <div className="long-line" style={this.props.step >= 6 ? {background: '#ffd200'} : {background: '#dfdfe4'}}></div>
            <div className="num">
                <img src={ this.props.step >= 6 ? "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_6_active.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/progress/icon_picker_6.svg"} alt=""/>
            </div>
            <div className="short-line" style={this.props.step === 6 ? {background: '#ffd200'} : {background: '#dfdfe4'}}></div>
        </div>
    }
}