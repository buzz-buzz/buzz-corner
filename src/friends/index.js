import React, {Component} from 'react';
import Resources from '../resources';
import Footer from '../layout/footer';
import WhiteSpace from '../common/commonComponent/whiteSpace';
import Track from "../common/track";
import './index.css';

class Friends extends Component {
    constructor() {
        super();

        this.state = {
            friends_type: 1
        };

        this.friendTypeOne = this.friendTypeOne.bind(this);
        this.friendTypeTwo = this.friendTypeTwo.bind(this);
    }

    friendTypeOne() {
        Track.event('好友_点击外籍好友Tab');

        let type = this.state.friends_type;

        if (type !== 1) {
            this.setState({
                friends_type: 1
            });
        }
    }

    friendTypeTwo() {
        Track.event('好友_点击中方好友Tab');

        let type = this.state.friends_type;

        if (type !== 2) {
            this.setState({
                friends_type: 2
            });
        }
    }


    async componentWillMount() {
        Track.event('好友_好友页面展示');

        //TitleSet.setTitle(Resources.getInstance().footerFriends);
    }

    render() {
        return (
            <div className="friends-page">
                <div className="friends-tab">
                    <div className="first" onClick={this.friendTypeOne} style={this.state.friends_type === 1 ? {color: '#f7b52a'} : {}}>
                        <span>{Resources.getInstance().friendsTabForeign}</span>
                    </div>
                    <div onClick={this.friendTypeTwo} style={this.state.friends_type === 2 ? {color: '#f7b52a'} : {}}>
                        <span>{Resources.getInstance().friendsTabChinese}</span>
                    </div>
                </div>
                <div className="friends-content">
                    <WhiteSpace message={Resources.getInstance().developWord} src="//cdn-corner.resource.buzzbuzzenglish.com/icon_blank%20page.png"/>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Friends;
