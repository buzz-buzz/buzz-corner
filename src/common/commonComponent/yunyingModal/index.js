import React from 'react';
import './index.css';

export default class YunyingModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            new_images: this.resetBannerData(),
            active: this.props.bannerData[0].banner_id || 1,
            direction: 'right',
            touched: false,
            touchStartX: undefined,
            canTouched: undefined,
            cancelTouched: undefined,
            swipe: undefined
        };

        console.log(this.state.new_images);

        this.moveImage = this.moveImage.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.goBannerPage = this.goBannerPage.bind(this);
    }

    resetBannerData(){
        //handle the arr
        let clonedBanner = this.props.bannerData.slice();
        console.log('props');
        console.log(this.props.bannerData);

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
        window.open(url);
    }

    moveImage(event) {
        if(this.state.canTouched){
            let moveLength = event.touches[0].clientX - this.state.touchStartX;

            if(moveLength < 80 && moveLength > -80){
                document.getElementById('yunying-container').style.left = -375 + moveLength + 'px';
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
               document.getElementById('yunying-container').style.left = '-375px';
            }
        });
    }

    moveRightOnce(){
        document.getElementById('yunying-container').style.animation = 'modal-swipe-right 1s linear';

        let updateArray = window.setTimeout(() => {
            let newImages = this.state.new_images.slice();
            let cut;

            cut = newImages.shift();
            newImages.push(cut);

            this.setState({new_images: newImages, active: newImages[1].banner_id}, () => {
                document.getElementById('yunying-container').style.animation = '';
                window.clearInterval(updateArray);
            });
        }, 1000);
    }

    moveLeftOnce(){
        document.getElementById('yunying-container').style.animation = 'modal-swipe-left 1s linear';

        let updateArray = window.setTimeout(() => {
            let newImages = this.state.new_images.slice();
            let cut;

            cut = newImages[newImages.length - 1];
            newImages.pop();
            newImages.unshift(cut);

            this.setState({new_images: newImages, active: newImages[1].banner_id}, () => {
                document.getElementById('yunying-container').style.animation = '';
                window.clearInterval(updateArray);
            });
        }, 1000);
    }

    moveToSuitable(){
        let nowLocation = document.getElementById('yunying-container').style.left;
        nowLocation = parseInt(nowLocation.replace('px', ''), 10);
        console.log(nowLocation);
        if(nowLocation > -375){
            //move right
            let moveRight = window.setInterval(() => {
                let latestLocation = parseInt(document.getElementById('yunying-container').style.left.replace('px', ''), 10);
                if(latestLocation < 0){
                    document.getElementById('yunying-container').style.left = latestLocation + (-nowLocation)/10 + 'px';
                }else{
                    document.getElementById('yunying-container').style.left = '0px';
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
                    document.getElementById('yunying-container').style.left = '-375px';
                    window.clearInterval(updateArray);
                });
            }, 300);
        }else{
            //move left
            let moveLeft = window.setInterval(() => {
                let latestLocation = parseInt(document.getElementById('yunying-container').style.left.replace('px', ''), 10);
                if(latestLocation > -750){
                    document.getElementById('yunying-container').style.left = latestLocation - (-nowLocation)/10 + 'px';
                }else{
                    document.getElementById('yunying-container').style.left = '-750px';
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
                    document.getElementById('yunying-container').style.left = '-375px';
                    window.clearInterval(updateArray);
                });
            }, 300);
        }
    }

    componentWillMount() {
        if(this.props.bannerData && this.props.bannerData.length && this.props.bannerData.length > 1){
            this.beginPlaying();
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
            <div className="main-div">
                <div id="yunying-container" className="images-container" style={{width: this.state.new_images.length * 100 + '%'}}>
                    {
                        this.state.new_images && this.state.new_images.length ?
                            this.state.new_images.map((item, index) => {
                                return <div className="img-container" key={index}
                                            onTouchMove={this.moveImage} onTouchStart={this.touchStart}
                                            onTouchEnd={this.touchEnd} onClick={this.goBannerPage(item.url)}
                                >
                                    <img src={item.img_url + '?imageView2/1/w/375/h/160'} alt=""/>
                                </div>
                            })
                            : ''
                    }
                </div>
                <div className="images-active">
                    {
                        this.props.bannerData && this.props.bannerData.length ?
                            this.props.bannerData.map((item, index) => {
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