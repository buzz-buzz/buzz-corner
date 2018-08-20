import React from 'react';
import BiggerImage from '../imageBigger';
import './index.css';

export default class ImageSelect extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            urls: [
                '//cdn-corner.resource.buzzbuzzenglish.com/placement/1.jpg',
                '//cdn-corner.resource.buzzbuzzenglish.com/placement/2.jpg',
                '//cdn-corner.resource.buzzbuzzenglish.com/placement/3.jpg',
                '//cdn-corner.resource.buzzbuzzenglish.com/placement/4.jpg',
                '//cdn-corner.resource.buzzbuzzenglish.com/placement/5.jpg',
                '//cdn-corner.resource.buzzbuzzenglish.com/placement/6.jpg'
            ],
            biggerModal: false
        }

        this.closeBigger = this.closeBigger.bind(this);
        this.openBigger = this.openBigger.bind(this);
    }

    closeBigger(){
        this.setState({biggerModal: false, biggerUrl: ''});
    }

    openBigger(event, url){
        this.setState({biggerModal: true, biggerUrl: url});
    }

    render(){
        return (
            <div className="placement-images">
                {
                    this.state.urls.map((item, index) => {
                        return <div className="placement-image-item" key={index}
                        >
                            <img src={item} alt="" onClick={(event) => this.openBigger(event, item)} />
                            <div className="select-status" onClick={(event) => this.props.select(event, this.props.step - 1, item)}>
                                <div>
                                    <img src={ this.props.answers && this.props.answers.length &&
                                    this.props.answers[this.props.step - 1] &&
                                    this.props.answers[this.props.step - 1].indexOf(item) > -1 ?
                                        "//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_select_active.svg"
                                        : "//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_select.svg" } alt=""/>
                                </div>
                            </div>
                        </div>
                    })
                }
                {
                    this.state.biggerModal &&
                    <BiggerImage url={this.state.biggerUrl} closeModal={this.closeBigger} />
                }
            </div>
        )
    }
}