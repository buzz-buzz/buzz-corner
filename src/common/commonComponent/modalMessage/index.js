import React, {Component} from 'react';
import './index.css';

const ToastDuration = {
    long: 5000,
    short: 3000
}

export default class ModalMessage extends Component {
    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() {
    }

    componentWillReceiveProps(props) {
        this.setState({
            modalShow: props.modalShow,
            duration: props.duration
        }, () => {
            if (this.state.duration) {
                setTimeout(() => {
                    this.setState({modalShow: false})
                }, ToastDuration[this.state.duration] || this.state.duration)
            }
        });
    }

    render() {
        return (
            this.state.modalShow ?
                <div className={this.props.modalName === 'error' ? 'error' : 'success'} style={this.props.style || {}}>
                    {this.props.modalContent}
                </div> : ''
        );
    }
}