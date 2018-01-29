import React, {Component} from 'react';
import Resources from '../../resources';
import {Container, Form, Message, Button} from 'semantic-ui-react';
import ServiceProxy from '../../service-proxy';

class classManage extends Component {
    constructor() {
        super();

        this.state = {
            message: '未选择'
        };

        this.submit = this.submit.bind(this);
    }

    handleChange(){
        //this.fileInput.files[0].name  .mp3, .wav, etc
        console.log(this.fileInput.files[0].type);

        if(this.fileInput.files[0].type.indexOf('audio') < 0){
            this.setState({
                message: '请选择音频文件! '
            });
        }else{
            this.setState({
                message: '已选择: ' + this.fileInput.files[0].name
            });
        }
    }

    async submit() {
        try {
            //To qiniu
            let qiniu_token = await  ServiceProxy.proxy('/qiniu/token', {
                method: 'GET'
            });

            if(!qiniu_token.uptoken){
                throw new Error(Resources.getInstance().avatarTokenWrong);
            }

            let fileForm = new FormData();

            fileForm.append("name", this.fileInput.files[0].name);
            fileForm.append("file", this.fileInput.files[0]);
            fileForm.append("token", qiniu_token.uptoken);

            let result = await ServiceProxy.proxy(qiniu_token.upload_url,{
                method: 'POST',
                body: fileForm,
                credentials: undefined,
                headers: undefined
            });

            console.log('resule', result);
        } catch (ex) {
            console.error(ex);

        }
    }

    render() {
        return (
            <Container fluid>
                <h1 style={{margin: '14px 0', textAlign: 'center'}}>课程管理</h1>
                <Form>
                    <h4>示例音频</h4>
                    <Form.Group widths='equal'>
                        <div className="audio">
                            <input type="file" id="audio" accept="audio/*;"
                                   onChange={(e) => this.handleChange(e)}
                                   ref={input => {
                                       this.fileInput = input;
                                   }}
                                   name="audio"/>
                        </div>
                        <Message compact>
                            {this.state.message}
                        </Message>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content={Resources.getInstance().profileSunmitBtn}
                                    style={{margin: '2em auto', width: '100%', color: 'white', background: 'green'}}
                                    onClick={this.submit} />
                    </Form.Group>
                </Form>
            </Container>
        );
    }
}

export default classManage;