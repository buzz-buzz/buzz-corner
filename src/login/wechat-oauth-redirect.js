import React from 'react';
import LoadingModal from '../common/commonComponent/loadingModal';

export default class WechatOAuthRedirect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    async componentWillMount() {
        let response = await fetch(window.location.href);
        if (response.url !== window.location.href) {
            //window.location.href = response.url;
            console.log(response.url);
        }else{
            //location.href = '/';
        }
    }

    render() {
        return (
            <LoadingModal loadingModal={true} fullScreen={true}/>
        );
    }
}
