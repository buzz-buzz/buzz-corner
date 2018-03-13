import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import './index.css';

class Consult extends Component {
    constructor() {
        super();

        this.back = this.back.bind(this);
    }

    back(){
        window.history.back();
    }

    render() {
        return (
            <div className="consult-page">
                <div className="back-header">
                    <div>
                        <img onClick={this.back} style={{width: '20px'}} src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""/>
                    </div>
                </div>
                <div className="consult-content">
                    <div className="consult-avatar">
                        <img src="//p579tk2n2.bkt.clouddn.com/buzz-teacher.png" alt=""/>
                    </div>
                    <div className="consult-word">
                        <p>我是你的专属课程顾问</p>
                        <p>请通过如下方式和我联系</p>
                    </div>
                    <div className="consult-QR-code">
                        <img src="//p579tk2n2.bkt.clouddn.com/buzz-teacher-qr-code.jpeg" alt=""/>
                        <p>扫描二维码联系"BuzzBuzz导师"</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Consult;