import * as React from "react";
import '../../../../node_modules/video-react/dist/video-react.css';
import {Player} from "video-react";

export default class EmbedVideo extends React.Component {
    render() {
        return (
            <Player sources={this.props.sources} poster={this.props.poster} playsInline={true}>
                <source src={this.props.sources[0]}/>
            </Player>
        )
    }
}