import React, {Component} from 'react';
import Resources from '../../../resources';
import './index.css';

class ModalWelcome extends Component {
    render() {
        return (
            <div className="modal" style={this.props.welcome ? {display: 'flex'} : {display: 'none'}} onClick={this.props.closeWelcome}>
                <div className="content">
                    <div>
                        <div className="welcome-title">
                            <p>{Resources.getInstance().welcomePageTitle1}</p>
                            <p>{Resources.getInstance().welcomePageTitle2}</p>
                        </div>
                        {
                            window.navigator.language === 'zh-CN' ?
                                (
                                    <div className="welcome-info">
                                        <p>{Resources.getInstance().welcomePageWord1}</p>
                                        <p>{Resources.getInstance().welcomePageWord2}</p>
                                </div>
                                ):
                                (
                                    <div className="welcome-info">
                                        <p>{Resources.getInstance().welcomePageWord1 + Resources.getInstance().welcomePageWord2}</p>
                                    </div>
                                )
                        }
                        <div className="begin">
                            <div onClick={this.props.closeWelcome}>
                                <p>{Resources.getInstance().welcomePageBooking}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalWelcome;