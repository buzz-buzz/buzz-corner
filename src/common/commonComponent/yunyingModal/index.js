import React from 'react';
import Client from "../../../common/client";
import ServiceProxy from '../../../service-proxy';
import Track from "../../track";

import {connect} from 'react-redux';
import store from '../../../redux/store';
import {addYunYingData} from "../../../redux/actions";
import './index.css';

class YunyingModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            new_images: [],
            active: 1,
            direction: 'right',
            touched: false,
            touchStartX: undefined,
            canTouched: undefined,
            cancelTouched: undefined,
            swipe: undefined
        };
        
        this.bannerContainer = {};

        this.moveImage = this.moveImage.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.goBannerPage = this.goBannerPage.bind(this);
    }

    async getBannerData() {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/banner/available?position=index`
            }
        });
    }

    handleBannerData(banner_data, role){
        if(banner_data && banner_data.length){
            return banner_data.filter(function(item){
                return item.user_role && item.user_role.indexOf(role) > -1
            });
        }else{
            return [];
        }
    }

    resetBannerData(data){
        //handle the arr
        let clonedBanner = data.slice();

        if(clonedBanner.length > 0){
            switch (clonedBanner.length) {
                case 1:
                    clonedBanner.push(clonedBanner[0]);
                    clonedBanner.push(clonedBanner[0]);
                    clonedBanner.push(clonedBanner[0]);
                    return clonedBanner;
                case 2:
                    clonedBanner.unshift(clonedBanner[1]);
                    clonedBanner.push(clonedBanner[1]);
                    return clonedBanner;
                default:
                    let cut = clonedBanner[clonedBanner.length - 1];
                    clonedBanner.pop();
                    clonedBanner.unshift(cut);
                    return clonedBanner;
            }
        }else{
            return [];
        }
    }

    goBannerPage(url){
        Track.event('运营位_图片点击');

        window.open(url);
    }

    moveImage(event) {
        if(this.state.canTouched){
            let moveLength = event.touches[0].clientX - this.state.touchStartX;

            if(moveLength < 80 && moveLength > -80){
                this.bannerContainer.style.left = -375 + moveLength + 'px';
                //拖动距离不够 视为放弃
                this.setState({cancelTouched: true});
            }else{
                //直接移动到对应的位置 相当于触发touchEnd事件
                this.setState({touched: false, cancelTouched: false, canTouched: false}, () => {
                    this.moveToSuitable();
                });
            }
        }
    }

    touchStart(event) {
        this.setState({touched: true, canTouched: true, touchStartX: event.touches[0].clientX});
    }

    touchEnd(event) {
        this.setState({touched: false, canTouched: false}, () => {
            if(this.state.cancelTouched){
               //回到原地
               this.bannerContainer.style.left = '-100%';
            }
        });
    }

    moveRightOnce(){
        this.bannerContainer.style.animation = 'modal-swipe-right .5s linear';

        let updateArray = window.setTimeout(() => {
            let newImages = this.state.new_images.slice();
            let cut;

            cut = newImages.shift();
            newImages.push(cut);

            this.setState({new_images: newImages, active: newImages[1].banner_id}, () => {
                this.bannerContainer.style.animation = '';
                window.clearInterval(updateArray);
            });
        }, 500);
    }

    moveLeftOnce(){
        this.bannerContainer.style.animation = 'modal-swipe-left .5s linear';

        let updateArray = window.setTimeout(() => {
            let newImages = this.state.new_images.slice();
            let cut;

            cut = newImages[newImages.length - 1];
            newImages.pop();
            newImages.unshift(cut);

            this.setState({new_images: newImages, active: newImages[1].banner_id}, () => {
                this.bannerContainer.style.animation = '';
                window.clearInterval(updateArray);
            });
        }, 500);
    }

    moveToSuitable(){
        let nowLocation = this.bannerContainer.style.left;
        nowLocation = parseInt(nowLocation.replace('px', ''), 10);
        if(nowLocation > -375){
            //move right
            let moveRight = window.setInterval(() => {
                let latestLocation = parseInt(this.bannerContainer.style.left.replace('px', ''), 10);
                if(latestLocation < 0){
                    this.bannerContainer.style.left = latestLocation + (-nowLocation)/10 + 'px';
                }else{
                    this.bannerContainer.style.left = '0px';
                    window.clearInterval(moveRight);
                }
            }, 28);

            let updateArray = window.setTimeout(() => {
                let newImages = this.state.new_images.slice();
                let cut;

                cut = newImages[newImages.length - 1];
                newImages.pop();
                newImages.unshift(cut);

                this.setState({new_images: newImages, active: newImages[1].banner_id, swipe: true}, () => {
                    if(moveRight){
                        window.clearInterval(moveRight);
                    }
                    this.bannerContainer.style.left = '-100%';
                    window.clearInterval(updateArray);
                });
            }, 300);
        }else{
            //move left
            let moveLeft = window.setInterval(() => {
                let latestLocation = parseInt(this.bannerContainer.style.left.replace('px', ''), 10);
                if(latestLocation > -750){
                    this.bannerContainer.style.left = latestLocation - (-nowLocation)/10 + 'px';
                }else{
                    this.bannerContainer.style.left = '-200%';
                    window.clearInterval(moveLeft);
                }
            }, 28);

            let updateArray = window.setTimeout(() => {
                let newImages = this.state.new_images.slice();
                let cut;

                cut = newImages.shift();
                newImages.push(cut);

                this.setState({new_images: newImages, active: newImages[1].banner_id, swipe: true}, () => {
                    if(moveLeft){
                        window.clearInterval(moveLeft);
                    }
                    this.bannerContainer.style.left = '-100%';
                    window.clearInterval(updateArray);
                });
            }, 300);
        }
    }

    async componentWillMount() {
        try{
            //get data from redux, if no data, then get from DB
            if(this.props.yunYingData && this.props.yunYingData.length){
                console.log('有数据-----');
                console.log(this.props.yunYingData);
                this.setState({
                    bannerData: this.props.yunYingData,
                    new_images:this.resetBannerData(this.props.yunYingData)
                }, () => {
                    if( this.props.yunYingData.length > 1){
                        this.beginPlaying();
                    }
                });
            }else{
                console.log('无数据-----');
                let bannerData = this.handleBannerData(await this.getBannerData(), this.props.role);

                if(bannerData && bannerData.length && bannerData.length > 0){
                    Track.event('运营位_页面展示');
                    //保存在redux
                    store.dispatch(addYunYingData(bannerData));

                    this.setState({
                        bannerData: bannerData,
                        new_images:this.resetBannerData(bannerData)
                    }, () => {
                        if( bannerData.length > 1){
                            this.beginPlaying();
                        }
                    });
                }
            }
        }
        catch (ex){
            Track.event('运营位_页面出错');
        }
    }

    beginPlaying(){
        if (!this.state.interval) {
            this.setState({
                interval: window.setInterval(() => {
                    if (!this.state.touched && !this.state.swipe) {
                        if (this.state.direction === 'right') {
                            this.moveRightOnce();
                        } else {
                            this.moveLeftOnce();
                        }
                    }else{
                        this.setState({swipe: false});
                    }
                }, 6000)
            });
        }
    }

    cancelPlaying(){
        if (this.state.interval) {
            window.clearInterval(this.state.interval);
        }
    }

    componentWillUnmount() {
        this.cancelPlaying();
    }

    render() {
        return (
            <div className="main-div" style={{width: this.props.width || '375px'}}>
                {
                    this.state.new_images && this.state.new_images.length ?
                        <img src={  Client.getClient() === 'phone' ? this.state.new_images[0].img_url : this.state.new_images[0].img_url_tablet} alt=""/> : ''
                }
                <div ref={div => {this.bannerContainer = div;}}
                     className="images-container" style={{width: this.state.new_images.length * 100 + '%'}}>
                    {
                        this.state.new_images && this.state.new_images.length ?
                            this.state.new_images.map((item, index) => {
                                return <div className="img-container" key={index} 
                                            onTouchMove={this.moveImage} onTouchStart={this.touchStart}
                                            onTouchEnd={this.touchEnd} onClick={ () => this.goBannerPage(item.url)}
                                >
                                    <img src={ Client.getClient() === 'phone' ? item.img_url : item.img_url_tablet} alt=""/>
                                </div>
                            })
                            : ''
                    }
                </div>
                <div className="images-active">
                    {
                        this.state.bannerData && this.state.bannerData.length ?
                            this.state.bannerData.map((item, index) => {
                                return <div className={ this.state.active === item.banner_id ? "images-dot active" : "images-dot"}
                                            key={index}
                                ></div>
                            })
                            : ''
                    }
                </div>
            </div>
        )
    }
}

export default connect(store => {
    return {
        yunYingData: store.yunYingList
    }
}, null)(YunyingModal);