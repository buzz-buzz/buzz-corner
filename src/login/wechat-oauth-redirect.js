import React from 'react';
import LoadingModal from '../common/commonComponent/loadingModal';

export default class WechatOAuthRedirect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    async componentDidMount() {
        console.log('link = ', window.location.href);
        let response = await fetch(window.location.href);
        if (response.url) {
            window.location.href = response.url;
            return;
        }
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <LoadingModal loadingModal={true} fullScreen={true} />
        );
    }
}