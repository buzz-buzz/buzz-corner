import * as React from "react";
import CurrentUser from "../membership/user";
import {browserHistory} from "react-router";
import LoadingModal from '../common/commonComponent/loadingModal';
import URLHelper from "../common/url-helper";

export default class EntryPoint extends React.Component {
    constructor() {
        super();

        this.state = {loadingModal: true}
    }

    componentDidMount() {
        let userId = CurrentUser.getUserId();

        let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url');

        if (userId) {
            browserHistory.push(returnUrl  ||  '/home');
        } else {
            browserHistory.push(`/select-role?return_url=${returnUrl}`);
        }
    }

    componentWillUnmount() {
        this.setState({loadingModal: false});
    }

    render() {
        return (
            <LoadingModal loadingModal={this.state.loadingModal}/>
        )
    }
}
