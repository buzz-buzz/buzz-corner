import React, {Component} from 'react';
import Footer from '../layout/footer';
import './index.css';

class Reward extends Component {
    constructor() {
        super();

        this.state = {};
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="reward-page">
                <div className="header-with-go-back">
                    <div className="logo-without-back">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" alt="Buzzbuzz logo"/>
                        </div>
                    </div>
                </div>
                <div className="my-badge">
                    <div className="badge-title">
                        <p>My badge</p>
                    </div>
                    <div className="badge">
                        <div className="blue-diamond">
                            <img src="//resource.buzzbuzzenglish.com/Blue.png" alt=""/>
                            <p>Blue</p>
                            <p>Diamond</p>
                        </div>
                        <div className="red-diamond">
                            <img src="//resource.buzzbuzzenglish.com/Red.png" alt=""/>
                            <p>Red</p>
                            <p>Diamond</p>
                        </div>
                        <div className="yellow-diamond">
                            <img src="//resource.buzzbuzzenglish.com/Yellow.png" alt=""/>
                            <p>Yellow</p>
                            <p>Diamond</p>
                        </div>
                    </div>
                    <div className="badge-rule">
                        <p>查看获取规则</p>
                    </div>
                </div>
                <div className="miles">
                    <div className="title">BuzzBuzz Miles</div>
                    <div className="buzz-miles">
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/Bitmap.png" alt="Buzzbuzz"/>
                        <span>0</span>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Reward;