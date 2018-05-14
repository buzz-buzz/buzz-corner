import ServiceProxy from '../service-proxy'

export const TabletAudioStatus = {
    notStarted: 'not started',
    startingRecording: 'starting recording',
    stoppingRecording: 'stopping recording',
    uploadingRecording: 'uploading recording',
    uploadingToQiniu: 'uploading to qiniu',
    doneRecording: 'done recording',
    playingSound: 'playing sound',
    stoppingSound: 'stopping sound'
};

//window.MediaSource = window.MediaSource || window.WebKitMediaSource;
// let mediaSource = new MediaSource();
// mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
let mediaRecorder;
let recordedBlobs = [];
let recordReadyStatus = false;


// function handleSourceOpen(event) {
//     mediaSource.addSourceBuffer('audio/webm');
// }


function handleSuccess(stream) {
    window.stream = stream;
    recordReadyStatus = true;
}

function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
    recordReadyStatus = false;
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function handleStop(event) {
    console.log('Recorder stopped: ', event);
}

export default class TabletAudio {
    status = TabletAudioStatus.notStarted;


    constructor() {
        this.status = TabletAudioStatus.notStarted;
        this.localId = null;
        this.validBlobs = [];
    }

    static async init(){
        await navigator.mediaDevices.getUserMedia({audio: true}).then(handleSuccess).catch(handleError);
        return recordReadyStatus;
    }

    async stopRecording() {
        this.status = TabletAudioStatus.stoppingRecording;

        await mediaRecorder.stop();

        this.validBlobs = recordedBlobs;

        console.log('stop record...');

        return this.validBlobs;
    }


    async startRecording() {
        if(recordReadyStatus){
            this.status = TabletAudioStatus.startingRecording;
            recordedBlobs = [];
            let options = {mimeType: 'audio/webm'};
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = {mimeType: 'video/webm;codecs=vp8'};
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.log(options.mimeType + ' is not Supported');
                    options = {mimeType: 'video/webm'};
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
            mediaRecorder.onstop = handleStop;
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.start(10); // collect 10ms of data
            console.log('recording...');
        }else{
            alert('navigator.mediaDevices.getUserMedia didn\'t work!');
        }
    }

    play(){
        let audioNow = document.createElement('audio');
        let superBuffer = new Blob(this.validBlobs, {type: 'audio/mp3'});
        //recordedVideo.src = window.URL.createObjectURL(superBuffer);
        audioNow.muted = false;
        audioNow.src = window.URL.createObjectURL(superBuffer);
        audioNow.play();
    }

    async getQiniuLink() {
        this.status = TabletAudioStatus.uploadingToQiniu;

        //qiniu upload
        let qiniu_token = await ServiceProxy.proxyTo({
            body: {
                uri: '{config.endPoints.buzzService}/api/v1/qiniu/token',
                method: 'GET'
            }
        });

        if (!qiniu_token.uptoken) {
            throw new Error('qiniu token wrong');
        }

        let fileForm = new FormData();

        fileForm.append("name", new Date().getTime() + 'audio');
        fileForm.append("file", new Blob(this.validBlobs, {type: 'audio/mp3'}));
        fileForm.append("token", qiniu_token.uptoken);

        let result = await ServiceProxy.proxy(qiniu_token.upload_url, {
            method: 'POST',
            body: fileForm,
            credentials: undefined,
            headers: undefined
        });

        let url;

        if (!result.key || !result.hash) {
            url = '';
        }else{
            url = qiniu_token.resources_url + result.key;
        }

        alert(url);

        this.status = TabletAudioStatus.doneRecording;
        return url || ''
    }

    async stopRecordingWithQiniuLink() {
        await this.stopRecording();
        return await this.getQiniuLink();
    }
}
