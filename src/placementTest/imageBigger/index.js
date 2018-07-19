import React from 'react';
import './index.css';

export default class ImageBigger extends React.Component{
    render(){
        return (
            <div className="image-bigger" onClick={this.props.closeModal}>
                <img src={this.props.url} alt=""/>
            </div>
        )
    }
}