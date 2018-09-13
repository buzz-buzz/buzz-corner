import * as React from "react";
import LoadingModal from '../common/commonComponent/loadingModal';
import CurrentUser from "../membership/user";
import ErrorHandler from "../common/error-handler";

export default class SignOut extends React.Component {
    async componentWillMount() {
        await CurrentUser.signOutNoRedirect();
        await CurrentUser.getProfile();
    }

    componentDidCatch(error, info) {
        ErrorHandler.notify(error.message, error, info)
    }

    render() {
        return <LoadingModal loadingModal={true} fullScreen={true}/>
    }
}
