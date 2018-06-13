import * as React from "react";
import ServiceProxy from "../service-proxy";
import {browserHistory} from "react-router";
import LoadingModal from '../common/commonComponent/loadingModal';

export default class SignOut extends React.Component {
    async componentWillMount() {
        try {
            await ServiceProxy.proxy('/sign-out')
            browserHistory.push('/sign-in')
        } catch (ex) {
            console.error(ex);
        }
    }

    render() {
        return <LoadingModal loadingModal={true} fullScreen={true}/>
    }
}