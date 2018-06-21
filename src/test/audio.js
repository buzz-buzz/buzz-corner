import React from 'react';

let mediaRecorder;
let recordedBlobs = [];
let recordReadyStatus = false;

export default class AudioTest extends React.Component{
    constructor(){
        super();

        this.state = {
            recordReadyStatus: false,
            status: '0'
        };

        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.play = this.play.bind(this);
        this.test = this.test.bind(this);
    }

    async stopRecording() {
        this.setState({status: '录音停止'});

        alert(mediaRecorder.stop);

        await mediaRecorder.stop();

        return recordedBlobs;
    }


    async startRecording() {
        if(recordReadyStatus){
            recordedBlobs = [];
            let options = {mimeType: 'audio/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = {mimeType: 'audio/webm;codecs=vp8'};
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.log(options.mimeType + ' is not Supported');
                    options = {mimeType: 'audio/webm'};
                    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                        console.log(options.mimeType + ' is not Supported');
                        options = {mimeType: ''};
                    }
                }
            }
            try {
                mediaRecorder = new MediaRecorder(window.stream, options);
            } catch (e) {
                alert('Exception while creating MediaRecorder: '
                    + e + '. mimeType: ' + options.mimeType);
                return;
            }
            mediaRecorder.onstop = this.handleStop;
            mediaRecorder.ondataavailable = this.handleDataAvailable;
            mediaRecorder.start(10); // collect 10ms of data
            this.setState({status: '录音中'});
            console.log('recording...');
        }else{
            alert('navigator.mediaDevices.getUserMedia didn\'t work!');
        }
    }

    handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    handleStop(event) {
        console.log('Recorder stopped: ', event);
    }

    play(){
        let audioNow = document.createElement('audio');
        let superBuffer = new Blob(recordedBlobs, {type: 'audio/mp3'});
        audioNow.muted = false;
        audioNow.src = window.URL.createObjectURL(superBuffer);
        audioNow.play();

        this.setState({status: '录音播放'});
    }

    test(){
        this.setState({status: '录音测试'});

        alert(window.MediaRecorder || 'MediaRecorder no supported');

        recordedBlobs = [];
        let options = {mimeType: 'audio/webm'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: 'audio/webm;codecs=vp8'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = {mimeType: 'audio/webm'};
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.log(options.mimeType + ' is not Supported');
                    options = {mimeType: ''};
                }
            }
        }
        try {
            mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            alert('Exception while creating MediaRecorder: '
                + e + '. mimeType: ' + options.mimeType);
            return;
        }

        alert(mediaRecorder);
        alert(mediaRecorder.start);

        mediaRecorder.onstop = this.handleStop;
        mediaRecorder.ondataavailable = this.handleDataAvailable;
        mediaRecorder.start(10); // collect 10ms of data
        console.log('recording...');
    }

    async componentWillMount(){
        function handleSuccess(stream) {
            window.stream = stream;
            recordReadyStatus = true;
        }

        function handleError(error) {
            console.log('navigator.getUserMedia error: ', error);
            recordReadyStatus = false;
        }

        await navigator.mediaDevices.getUserMedia({audio: true}).then(handleSuccess).catch(handleError);

        if(recordReadyStatus){
            this.setState({recordReadyStatus: true});
        }
    }

    render(){
       return(
           <div>
               <h1>{this.state.recordReadyStatus ? '录音已就绪' : '录音未就绪'}</h1>
               <h3>{this.state.status}</h3>
               <button onClick={this.startRecording}>录音</button>
               <br/>
               <button onClick={this.stopRecording}>停止</button>
               <br/>
               <button onClick={this.play}>播放</button>
               <br/>
               <button onClick={this.test}>测试</button>
           </div>
       )
    }
}