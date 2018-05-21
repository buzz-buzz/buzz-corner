import * as React from "react";
import TimeHelper from "../../timeHelper";

export default class StopWatch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeElapsed: 0,
            timerId: null,
            timer: false
        }

        this.startTick = this.startTick.bind(this)
        this.stopTick = this.stopTick.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.startTick();
        } else {
            this.stopTick();
        }
    }

    componentWillUnmount() {
        this.stopTick();

        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return
        };
    }

    render() {
        return (
            <div>{TimeHelper.formatSecondsToHHMMSS(this.state.timeElapsed)}</div>
        )
    }

    startTick() {
        if(!this.state.timer){
            this.setState({
                timer: true,
                timeElapsed: this.props.start,
                timerId: window.setInterval(() => {
                    this.setState({
                        timeElapsed: this.state.timeElapsed + 1
                    }, () => {
                        if (this.state.timeElapsed >= 59) {
                            this.props.timeout();
                            this.stopTick();
                        }
                    })
                }, 1000)
            })
        }
    }

    stopTick() {
        if (this.state.timerId) {
            this.setState({timer: false});
            clearInterval(this.state.timerId);
        }
    }
}