import * as React from "react";
import LoadingModal from '../common/commonComponent/loadingModal';
import CurrentUser from "../membership/user";

export default class SignOut extends React.Component {
    async componentWillMount() {
        await CurrentUser.signOut();
    }

    render() {
        return <LoadingModal loadingModal={true} fullScreen={true}/>
    }
}
