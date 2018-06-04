import * as React from "react";

export default class BuzzInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pressing: false,
        };

    }

    componentDidMount(){

    }

    onRefresh(){

    }

    onLoadMore(){

    }

    dragLoadingDone() {
        this.setState({dragLoading: false});
        //this.transformScroller(0.1, 0);
    }
    scrollLoadingDone() {
        this.setState({scrollerLoading: false});
        //this.refs.dropDownRefreshText.innerHTML = (dropDownRefreshText = XLJZ);
    }

    render() {
        return (
            <div></div>
        )
    }
}