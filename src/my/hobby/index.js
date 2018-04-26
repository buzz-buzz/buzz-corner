import './index.css'
import React from 'react';

export default class Hobby extends React.Component {
    render() {
        return <div className="hobby" style={ this.props.selected ?{backgroundColor: this.props.bgColor} :{backgroundColor: '#f4f5f9'}}>
            <div className="circle" style={ this.props.selected ? {backgroundColor: this.props.circleColor} : {backgroundColor: '#dfdfe4'}}>
                <img src={this.props.src} alt=""/>
            </div>
            <p className="word" style={ this.props.selected ? {color: this.props.wordColor} : {color: '#666'}}>
                {this.props.word}
            </p>
            <a  onClick={this.props.select} name={this.props.name} >Buzz</a>
        </div>
    }
}