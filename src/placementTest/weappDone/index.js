import React from 'react';
import './index.css';

export default class WeappDone extends React.Component{
    render(){
        return (
            <div className="weapp-done">
                <div className="placement-img"></div>
                <div className="placement-word"></div>
                <div className="placement-good"></div>
                <div className="placement-qr-code"></div>
            </div>
        )
    }
}