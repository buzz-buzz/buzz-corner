import * as React from "react";
import {Button} from "semantic-ui-react";
import './buzz-round-button.css';

export default class BuzzRoundButton extends React.Component {
    render() {
        return (
            <div className="buzz-round-button">
                <Button style={{paddingLeft: this.props.paddingLeft}} onClick={this.props.onClick}
                        loading={this.props.loading} disabled={this.props.disabled}>
                    {
                        this.props.children
                    }
                </Button>
            </div>
        )
    }
}