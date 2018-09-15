import React from 'react';
import {Flag} from "semantic-ui-react";
import {countryCodeMap} from "../../../common/country-code-map";
import {iso3166_data} from 'phone';
import './index.css';

const countryList = iso3166_data.map(i => ({
    mobileLength: i.phone_number_lengths,
    mobileBeginWith: i.mobile_begin_with,
    countryName: i.country_name,
    countryLongName: i.alpha3,
    countryShortName: i.alpha2,
    countryCode: i.country_code
}));

let countryOptions = countryList.map(c => ({
    key: c.countryLongName,
    value: c.countryLongName,
    flag: c.countryShortName.toLowerCase(),
    text: `(+${c.countryCode})@${c.countryName}`
})).filter(item=>{return item.flag !== 'sx' && item.text.split('@')[1].length <= 20;});

let china = countryOptions.filter(item=>item.value==='CHN')[0];
countryOptions = countryOptions.filter(item=>item.value!=='CHN');
countryOptions.unshift(china);

export default class MobileCountryCode extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            popShow: false,
            code: {value: props.value || 'CHN'}
        };

        this.showSelectCountry = this.showSelectCountry.bind(this);
        this.hideSelectCountry = this.hideSelectCountry.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onCountryCodeChange = this.onCountryCodeChange.bind(this);
    }

    showSelectCountry(){
        this.setState({popShow: true});
    }

    hideSelectCountry(){
        this.setState({popShow: false});
    }

    onSelectChange(event, value){
        this.setState({code: value});
    }

    onCountryCodeChange(){
        console.log('---------------');
        this.props.onCountryCodeChange('', this.state.code);
        this.hideSelectCountry();
    }

    render(){
        return (
            <div className="mobile-country" style={this.props.styleParent ? this.props.styleParent : {}}>
                <div className="show-value" onClick={this.showSelectCountry} style={this.props.style ? this.props.style : {}} >{this.props.value} +({countryCodeMap[this.props.value]})</div>
                {
                    this.state.popShow &&
                    <div className="pop-mobile-country">
                        <div className="grey" onClick={this.hideSelectCountry}></div>
                        <div className="select-model">
                            <div className="mobile-info">
                                <div className="title">
                                    国家和地区
                                    <div className="shadow"></div>
                                </div>
                                <div className="value">{this.state.code.value} +({countryCodeMap[this.state.code.value]})</div>
                                <div className="btn">
                                    <button onClick={this.onCountryCodeChange}>确定</button>
                                </div>
                            </div>
                            <div className="mobile-list">
                                {
                                    countryOptions && countryOptions.length &&
                                    countryOptions.map((item, index) => <div
                                        onClick={(event) => this.onSelectChange(event, item)}
                                        className={ item.value === this.state.code.value ? "item active" : "item"} key={index}>
                                        <div><Flag name={item.flag}/>{item.text.split('@')[0]}</div><div>{item.text.split('@')[1]}</div>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}