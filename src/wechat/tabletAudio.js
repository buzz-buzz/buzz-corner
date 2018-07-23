import ServiceProxy from '../service-proxy';

let mediaRecorder;
let recordedBlobs = [];
let recordReadyStatus = false;

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
    constructor() {
        this.validBlobs = [];
    }

    static async init(callback) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
            await navigator.mediaDevices.getUserMedia({audio: true}).then(handleSuccess).catch(handleError);
            callback(recordReadyStatus);
        } else {
            callback(false);
        }
    }

    async stopRecording() {
        await mediaRecorder.stop();

        this.validBlobs = recordedBlobs;

        return this.validBlobs;
    }


    async startRecording() {
        if (recordReadyStatus) {
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
            mediaRecorder.onstop = handleStop;
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.start(10); // collect 10ms of data
            console.log('recording...');
        } else {
            alert('需要录音权限，请允许录音后重试…');

            throw handleError('录音功能出错');
        }
    }

    play() {
        try{
            let audioNow = document.createElement('audio');
            let superBuffer = new Blob(this.validBlobs, {type: 'audio/mp3'});
            audioNow.muted = false;
            audioNow.src = window.URL.createObjectURL(superBuffer);
            audioNow.play();
        }
        catch (ex){
            console.log('tablet play err:' + ex);
        }

    }

    async getQiniuLink() {
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
        } else {
            url = qiniu_token.resources_url + result.key;
        }

        return url || ''
    }

    async stopRecordingWithQiniuLink() {
        await this.stopRecording();
        return await this.getQiniuLink();
    }
}
