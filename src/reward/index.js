import React, {Component} from 'react';
import Resources from '../resources';
import CurrentUser from "../membership/user";
import Footer from '../layout/footer';
import Track from "../common/track";
import QiniuDomain from '../common/systemData/qiniuUrl';
import './index.css';

class Reward extends Component {
    constructor() {
        super();

        this.state = { integral: 0 };

        this.rewardRule = this.rewardRule.bind(this);
    }

    rewardRule(){
        Track.event('奖励_点击查看规则');
    }

    async componentDidMount() {
        Track.event('奖励_奖励页面展示');

        //TitleSet.setTitle(Resources.getInstance().footerReward);

        let profile = await CurrentUser.getProfile(true);

        this.setState({
            integral: profile.integral || 0
        });
    }

    componentWillUnmount(){
        //重写组件的setState方法，直接返回空
        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="reward-page">
                <div className="my-badge">
                    <div className="badge-title">
                        <p>{Resources.getInstance().rewardTitle}</p>
                    </div>
                    <div className="badge">
                        <div className="blue-diamond">
                            <img src= { QiniuDomain + "/Blue.png"} alt=""/>
                            <p style={{marginTop: '10px'}}>{Resources.getInstance().rewardBlueStone.length === 1 ? '' : Resources.getInstance().rewardBlueStone}</p>
                            <p>{Resources.getInstance().rewardDiamond.length === 1 ? Resources.getInstance().rewardBlueStone + Resources.getInstance().rewardDiamond : Resources.getInstance().rewardDiamond}</p>
                        </div>
                        <div className="red-diamond">
                            <img src= { QiniuDomain + "/Red.png"} alt=""/>
                            <p style={{marginTop: '10px'}}>{Resources.getInstance().rewardRedStone.length === 1 ? '' : Resources.getInstance().rewardRedStone}</p>
                            <p>{Resources.getInstance().rewardDiamond.length === 1 ? Resources.getInstance().rewardRedStone + Resources.getInstance().rewardDiamond : Resources.getInstance().rewardDiamond}</p>
                        </div>
                        <div className="yellow-diamond">
                            <img src={ QiniuDomain + "/Yellow.png"} alt=""/>
                            <p style={{marginTop: '10px'}}>{Resources.getInstance().rewardYellowStone.length === 1 ? '' : Resources.getInstance().rewardYellowStone}</p>
                            <p>{Resources.getInstance().rewardDiamond.length === 1 ? Resources.getInstance().rewardYellowStone + Resources.getInstance().rewardDiamond : Resources.getInstance().rewardDiamond}</p>
                        </div>
                    </div>
                    <div className="badge-rule" onClick={this.rewardRule}>
                        <p>{Resources.getInstance().rewardRules}</p>
                    </div>
                </div>
                <div className="miles">
                    <div className="title">{Resources.getInstance().rewardMiles}</div>
                    <div className="buzz-miles">
                        <img src= { QiniuDomain + "/Bitmap.png"} alt="Buzzbuzz"/>
                        <span>{this.state.integral}</span>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Reward;