import { browserHistory } from "react-router";

export default {
    back() {
        if(window.history.length > 1){
            window.history.go(-1);
        }else{
            browserHistory.push('/');
        }
    }
}
