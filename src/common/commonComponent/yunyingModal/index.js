import React from 'react';
import './index.css';

export default class YunyingModal extends React.Component {
    constructor() {
        super();

        this.state = {
            images: ['1', '2', '3', '4'],
            new_images: ['4', '1', '2', '3'],
            active: '1',
            direction: 'right',
            touched: false,
            touchStartX: undefined,
            canTouched: undefined,
            cancelTouched: undefined,
            swipe: undefined
        };

        this.moveImage = this.moveImage.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
        this.touchStart = this.touchStart.bind(this);
    }

    moveImage(event) {
        if(this.state.canTouched){
            let moveLength = event.touches[0].clientX - this.state.touchStartX;

            if(moveLength < 100 && moveLength > -100){
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

            this.setState({new_images: newImages, active: newImages[1]}, () => {
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

            this.setState({new_images: newImages, active: newImages[1]}, () => {
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

                this.setState({new_images: newImages, active: newImages[1], swipe: true}, () => {
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

                this.setState({new_images: newImages, active: newImages[1], swipe: true}, () => {
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
        this.beginPlaying();
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
                <div id="yunying-container" className="images-container">
                    {
                        this.state.images && this.state.images.length ?
                            this.state.new_images.map((item, index) => {
                                return <div className="img-container" key={index}
                                            onTouchMove={this.moveImage} onTouchStart={this.touchStart}
                                            onTouchEnd={this.touchEnd}
                                >{item}</div>
                            })
                            : ''
                    }
                </div>
                <div className="images-active">
                    {
                        this.state.images && this.state.images.length ?
                            this.state.images.map((item, index) => {
                                return <div className={ this.state.active === item ? "images-dot active" : "images-dot"}
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