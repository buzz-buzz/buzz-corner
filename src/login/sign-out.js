import * as React from "react";
import {browserHistory} from "react-router";
import LoadingModal from '../common/commonComponent/loadingModal';
import CurrentUser from "../membership/user";
import ErrorHandler from "../common/error-handler";

export default class SignOut extends React.Component {
    async componentWillMount() {
        await CurrentUser.signOutNoRedirect();
        browserHistory.push('/home');
    }

    componentDidCatch(error, info) {
        ErrorHandler.notify(error.message, error, info)
    }

    render() {
        return <LoadingModal loadingModal={true} fullScreen={true}/>
    }
}
