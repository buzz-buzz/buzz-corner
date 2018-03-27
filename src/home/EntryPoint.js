import * as React from "react";
import {Segment} from "semantic-ui-react";
import CurrentUser from "../membership/user";
import {browserHistory} from "react-router";

export default class EntryPoint extends React.Component {
    componentDidMount() {
        let userId = CurrentUser.getUserId();

        if (userId) {
            browserHistory.push('/home')
        } else {
            browserHistory.push('/sign-in')
        }
    }

    render() {
        return (
            <Segment loading></Segment>
        )
    }
}