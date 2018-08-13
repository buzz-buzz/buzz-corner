import Resources from "../resources";
import React from "react";
import {Button, Dropdown, Flag} from "semantic-ui-react";
import BuzzInput from "../common/commonComponent/buzzInput";
import {iso3166_data} from 'phone';
import {countryAlpha2Map, countryCodeMap} from "../common/country-code-map";
import './dropdown-ui.css'

const countryList = iso3166_data.map(i => ({
    mobileLength: i.phone_number_lengths,
    mobileBeginWith: i.mobile_begin_with,
    countryName: i.country_name,
    countryLongName: i.alpha3,
    countryShortName: i.alpha2,
    countryCode: i.country_code
}));

const countryOptions = countryList.map(c => ({
    key: c.countryLongName,
    value: c.countryLongName,
    flag: c.countryShortName.toLowerCase(),
    text: `(+${c.countryCode}) ${c.countryName}`
}));


export default (props) =>
    <div>
        <div className="phone-number">
            <Dropdown trigger={<span><Flag name={countryAlpha2Map[props.mobileCountry].toLowerCase()}/>+({countryCodeMap[props.mobileCountry]}) {props.mobileCountry}</span>} placeholder={Resources.getInstance().selectCountryCode}
                      search options={countryOptions}
                      style={{width: '80px', marginRight: '10px', minWidth: '120px', whiteSpace: 'nowrap',
                          display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '5px'}}
                      value={props.mobileCountry}
                      onChange={props.onCountryCodeChange}/>
            <BuzzInput type="number"
                       placeholder={Resources.getInstance().profilePhoneHolder}
                       width="60%"
                       value={props.profile.phone}
                       onChange={props.handleChange}
                       name='phone'
            />
        </div>
        <div className="check-number">
            <BuzzInput type="text"
                       placeholder={Resources.getInstance().profilePhoneLabel}
                       width="60%"
                       value={props.code}
                       onChange={props.handleCodeChange}
            />
            <Button style={props.waitSec ? {
                padding: 0,
                color: '#000'
            } : (props.mobileValid ? {
                padding: 0,
                color: 'white'
            } : {padding: 0, color: '#666'})} onClick={props.sms}
                    disabled={!props.mobileValid || props.waitSec > 0}>
                {props.waitSec ? Resources.getInstance().profilePhoneSend + '('+ props.waitSec +')' :
                    ( props.send ? Resources.getInstance().profilePhoneCheckAgain : Resources.getInstance().profilePhoneCheck)}
                </Button>
        </div>
    </div>
