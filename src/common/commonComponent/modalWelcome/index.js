import React, {Component} from 'react';
import {Link} from 'react-router';
import Resources from '../../../resources';
import {Modal} from 'semantic-ui-react';
import './index.css';

class ModalWelcome extends Component {
    constructor() {
        super();

        let strCookie = document.cookie;
        let arrCookie = strCookie.split(";");

        console.log(arrCookie);

        let welcome = false;
        for (let i = 0; i < arrCookie.length; i++) {
            let arr = arrCookie[i].split("=");
            if ("homepage" == arr[0]) {
                welcome = true;
                break;
            }
        }

        this.state = {
            welcome: welcome
        };

        this.closeWelcome = this.closeWelcome.bind(this);
    }

    closeWelcome(){
        this.setCookie("homepage", "1");

        console.log(document.cookie);

        this.setState({
            welcome: true
        });
    }

    setCookie(name, value, Days){
        if(Days == null || Days == ''){
            Days = 300;
        }

        let exp  = new Date();

        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();
    }

    render() {
        return (
           <div className="modal" style={this.state.welcome ? {display: 'none'} : {display: 'flex'}}>
               <div className="content">
                   <div>
                       <div className="welcome-title">
                           <p>欢迎加入</p>
                           <p>BuzzBuzz虚拟英语角</p>
                       </div>
                       <div className="welcome-info">
                           <p>轻松提高英语听说</p>
                           <p>结识外籍伙伴</p>
                       </div>
                       <div className="begin">
                           <div onClick={this.closeWelcome}>
                               <p>开始预定课程</p>
                           </div>
                       </div>
                       <div className="skip"  onClick={this.closeWelcome}>
                           跳过, 稍后完成
                       </div>
                   </div>
               </div>
           </div>
        );
    }
}

export default ModalWelcome;