import * as React from "react";
import CurrentUser from "../membership/user";
import {browserHistory} from "react-router";
import LoadingModal from '../common/commonComponent/loadingModal';

export default class EntryPoint extends React.Component {
    constructor() {
        super();

        this.state = {loadingModal: true}
    }

    componentDidMount() {
        let userId = CurrentUser.getUserId();

        if (userId) {
            browserHistory.push('/home')
        } else {
            browserHistory.push('/select-role')
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
