import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import './index.css';

class loginEntrance extends Component {
    constructor() {
        super();

        this.chineseChildEntrance = this.chineseChildEntrance.bind(this);

    }

    chineseChildEntrance(){
        browserHistory.push('/login-for-wechat');
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="login-entrance">
                <div className="entrance-logo">
                    <div className="logo">
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                    </div>
                    <div className="entrance-word">
                        <p>赋能同伴，成就更好的自己!</p>
                        <p>结识英语母语国家的少年，</p>
                        <p>开启你的国际交流旅程。</p>
                    </div>
                </div>
                <div className="entrance-choose">
                    <div onClick={this.chineseChildEntrance}>
                        <img src="" alt=""/>
                        <p>中国少年</p>
                    </div>
                    <div>
                        <img src="" alt=""/>
                        <p>外籍学伴</p>
                    </div>
                </div>
                <div className="preview-video">
                    <p>看其他伙伴是怎样互动的?</p>
                    <div className="preview-video-btn">
                        <Form.Group widths='equal'>
                            <Form.Field control={Button}
                                        content='去围观'/>
                        </Form.Group>
                    </div>
                </div>
            </div>
        );
    }
}

export default loginEntrance;