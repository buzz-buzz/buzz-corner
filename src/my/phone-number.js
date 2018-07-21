import Resources from "../resources";
import React from "react";
import {Button} from "semantic-ui-react";
import BuzzInput from "../common/commonComponent/buzzInput";

export default (props) =>
    <div>
        <div className="phone-number">
            <Button>{Resources.getInstance().profilePhoneInfo}</Button>
            <BuzzInput type="number" placeholder={Resources.getInstance().profilePhoneHolder}
                       width="60%"
                       value={props.profile.phone}
                       onChange={props.handleChange}
                       name='phone'
            />
        </div>
        <div className="check-number">
            <BuzzInput type="text" placeholder={Resources.getInstance().profilePhoneLabel}
                       width="60%"
                       value={props.code}
                       onChange={props.handleCodeChange}
            />
            <Button style={props.waitSec ? {padding: 0, color: '#000'} : (props.mobileValid ? {
                padding: 0,
                color: 'white'
            } : {padding: 0, color: '#666'})} onClick={props.sms}
                    disabled={!props.mobileValid || props.waitSec > 0}>{props.waitSec || Resources.getInstance().profilePhoneCheck}</Button>
        </div>
    </div>