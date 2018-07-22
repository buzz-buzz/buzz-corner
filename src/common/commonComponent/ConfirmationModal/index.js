import React from 'react';
import Button50px from '../submitButton50px';
import './index.css';

function stopPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}

export default (props) => (
    <div className="pop-modal"
         style={props.modal ? {} : {display: 'none'}}
         onClick={props.cancel}>
        <div className="pop-content" onClick={stopPropagation}>
            <div className="attention">
                {props.title}
            </div>
            <div className="attention-info">
                {props.info}
            </div>
            <div className="chose-buttons">
                <Button50px submit={props.cancel}
                            text={props.cancelText}/>
                <p onClick={props.sure}>{props.sureText}</p>
            </div>
        </div>
    </div>
)

