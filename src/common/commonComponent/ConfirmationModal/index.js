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
            <div className="att-img">
                <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_Minus.svg" alt=""/>
            </div>
            <div className="attention">
                {props.title}
            </div>
            <div className="attention-info">
                {props.info}
            </div>
            <div className="chose-buttons">
                <Button50px submit={props.sure}
                            style={{fontSize: '15px', background: '#ffd200'}}
                            text={props.sureText}/>
                <Button50px submit={props.cancel}
                            style={{background: 'white', border: 'solid 1px #dfdfe4', color: '#666', fontSize: '15px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)'}}
                            text={props.cancelText}/>
            </div>
        </div>
    </div>
)

