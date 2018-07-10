import ModalMessage from "./index";
import {connect} from 'react-redux';

export default connect(store => {
    return ({
        modalContent: store.toast.message,
        modalShow: store.toast.show
    })
})(ModalMessage);
