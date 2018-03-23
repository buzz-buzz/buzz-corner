import React from 'react';
import './index.css';


export default class BuzzModal extends React.Component {

    render(body) {
        console.log("BuzzModal.props = ", this.props)
        return (
            <div className="buzz-modal" style={this.props.open ? {display: 'flex'} : {display: 'none'}}
                 onTouchStart={this.props.onClose}>
                <div className="content" onTouchStart={event => event.stopPropagation()}>
                    {body}
                </div>
            </div>
        );
    }
}