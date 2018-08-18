import Resources from "../resources";
import React from "react";
import {Button, Dropdown} from "semantic-ui-react";
import BuzzInput from "../common/commonComponent/buzzInput";
import {iso3166_data} from 'phone';
import {countryCodeMap} from "../common/country-code-map";
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
            <Dropdown trigger={<span>{props.mobileCountry} +({countryCodeMap[props.mobileCountry]})</span>}
                      placeholder={Resources.getInstance().selectCountryCode}
                      search options={countryOptions}
                      style={ props.dropDownStyle ? props.dropDownStyle : {
                              width: '100px', marginRight: '5px', minWidth: '120px', whiteSpace: 'nowrap',
                              display: 'flex', alignItems: 'center', borderRadius: '5px', paddingLeft: '15px'
                          }}
                      value={props.mobileCountry}
                      onChange={props.onCountryCodeChange}/>
            <BuzzInput type="number"
                       placeholder={Resources.getInstance().profilePhoneHolder}
                       value={props.profile.phone}
                       onChange={props.handleChange}
                       name='phone'
            />
        </div>
        {
            !props.codeModalNone &&
            <div className="check-number">
                <BuzzInput type="text"
                           placeholder={Resources.getInstance().profilePhoneLabel}
                           value={props.code}
                           onChange={props.handleCodeChange}
                />
                <Button style={props.waitSec || !props.mobileValid ? {
                        padding: 0,
                        color: '#fff',
                        background: '#dfdfe4'
                    } : {
                        padding: 0,
                        color: 'white'
                    }} onClick={props.sms}
                        disabled={!props.mobileValid || props.waitSec > 0}>
                    {props.waitSec ? Resources.getInstance().profilePhoneSend + '(' + props.waitSec + ')' :
                        ( props.send ? Resources.getInstance().profilePhoneCheckAgain : Resources.getInstance().profilePhoneCheck)}
                </Button>
            </div>
        }
    </div>
