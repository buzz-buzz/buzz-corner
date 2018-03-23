import * as React from "react";
import * as timeHelper from "../../timeHelper";

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

    componentWillUnMount() {
        window.clearInterval(this.state.timerId);
    }

    render() {
        return (
            <div>{timeHelper.formatSecondsToHHMMSS(this.state.timeElapsed)}</div>
        )
    }
}