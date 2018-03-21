import React from 'react'
import {Button, Container, Divider, Header, Message, Segment} from "semantic-ui-react"
import WechatAudio from "./audio";

const audio = new WechatAudio();
console.log('audio = ', audio);

export default class WechatDemo extends React.Component {
    constructor() {
        super()
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.playVoice = this.playVoice.bind(this)
        this.stopVoice = this.stopVoice.bind(this)
        this.state = {
            stauts: audio.status
        }
    }

    async componentDidMount() {
        try {
            if (!/MicroMessenger/.test(navigator.userAgent))
                return alert('非微信环境')
            const valid = await audio.init();
            this.setState({status: audio.status}, () => {
                console.log('status = ', audio.status);
            });
            this.forceUpdate();
            if (!valid)
                return alert('接口不支持')
        } catch (e) {
            console.error('checkJsApi', e)
            alert('微信JS-SDK错误')
        }
    }

    async start() {
        audio.startRecording();
        this.setState({status: audio.status}, () => {
            console.log('playing status = ', audio.status);
        });
    }

    async stop() {
        try {
            let url = await audio.stopRecordingWithQiniuLink();
            this.setState({status: audio.status});

            if (window.confirm('跳转外链: ' + url) === true) {
                window.location.href = url
            }
        } catch (error) {
            this.setState({error: true, message: JSON.stringify(error.message || error)})
        }
    }

    playVoice() {
        try {
            audio.play();
            this.setState({status: audio.status});
        } catch (error) {
            console.error(error);
            this.setState({error: true, message: JSON.stringify(error.message)})
        }
    }

    stopVoice() {
        audio.stop();
        this.setState({status: audio.status});
    }

    render() {
        return (<Container textAlign="center">
            <Segment>
                <Header>微信 demo</Header>


                <p>
                    {this.state.status}
                </p>

                <Divider horizontal/>
                <Button onClick={this.start}>开始录音</Button>
                <Button onClick={this.stop}>结束录音</Button>
                <Button onClick={this.playVoice}>播放录音</Button>
                <Button onClick={this.stopVoice}>结束录音</Button>
            </Segment>

            <Message error={this.state.error} list={[this.state.message]}/>
        </Container>)
    }
}
