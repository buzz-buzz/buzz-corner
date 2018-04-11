import * as React from "react";
import TimeHelper from "../../timeHelper";

export default class StopWatch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeElapsed: 0,
            timerId: null
        }
    }

    componentDidMount() {
        this.setState({
            timeElapsed: this.props.start,
            timerId: window.setInterval(() => {
                this.setState({
                    timeElapsed: this.state.timeElapsed + 1
                }, () => {
                    if (this.state.timeElapsed >= 59) {
                        this.props.timeout()
                    }
                })
            }, 1000)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            timeElapsed: nextProps.start
        })
    }

    componentWillUnmount(){
        //重写组件的setState方法，直接返回空
        if(this.state.timerId){
            window.clearInterval(this.state.timerId);
        }

        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div>{TimeHelper.formatSecondsToHHMMSS(this.state.timeElapsed)}</div>
        )
    }
}