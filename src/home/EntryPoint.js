import * as React from "react";
import CurrentUser from "../membership/user";
import {browserHistory} from "react-router";
import LoadingModal from '../common/commonComponent/loadingModal';
import URLHelper from "../common/url-helper";

export default class EntryPoint extends React.Component {
    constructor() {
        super();
    }

    async componentDidMount() {
        let userId = CurrentUser.getUserId();

        let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url');

        if (userId) {
            let profile = await CurrentUser.getProfile(true);

            if (!profile.role) {
                browserHistory.push(`/select-role?return_url=${returnUrl}`);
                return;
            }else{
                browserHistory.push(returnUrl  ||  '/home');
            }
        } else {
            browserHistory.push(`/select-role?return_url=${returnUrl}`);
        }
    }

    render() {
        return (
            <LoadingModal loadingModal={true} fullScreen={true} />
        )
    }
}
