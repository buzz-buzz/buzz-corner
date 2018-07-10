import React, {Component} from 'react';
import Resources from '../../../resources';
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

    componentWillMount() {
        this.setup(this.props);
    }

    setup(props) {
        this.setState({
            modalShow: props.modalShow,
            duration: props.duration,
            modalContent: props.modalContent
        }, () => {
            if (this.state.duration) {
                setTimeout(() => {
                    this.setState({modalShow: false})
                }, ToastDuration[this.state.duration] || this.state.duration)
            }
        });
    }

    componentWillReceiveProps(props) {
        this.setup(props);
    }

    componentWillUpdate() {
    }

    show(message, duration = ToastDuration.long) {
        this.setup({
            modalShow: true,
            duration: duration,
            modalContent: message
        });
    }

    render() {
        return (
            <div className={this.props.modalName === 'success' ? 'success' : 'error'}
                 style={{...this.props.style, display: this.state.modalShow ? 'block' : 'none'}} ref={toast => {
                window.toast = this
            }}>
                {this.state.modalContent || Resources.getInstance().unkownError}
            </div>
        );
    }
}