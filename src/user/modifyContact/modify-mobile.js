import React from 'react';
import Resources from "../../resources";
import Button50px from '../../common/commonComponent/submitButton50px';
import {Dropdown} from "semantic-ui-react";
import {iso3166_data} from 'phone';

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
})).filter(item=>{return item.flag !== 'sx';});


export default (props) => (<div className="form-content" onClick={(e) => {
    e.stopPropagation();
}}>
    <div className="form-title">{Resources.getInstance().userUpdatephone}</div>

    <div className="two-items">
        <Dropdown placeholder={Resources.getInstance().selectCountryCode}
                  search selection options={countryOptions}
                  style={{
                      width: '100px', marginRight: '5px', minWidth: '120px', whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', borderRadius: '5px', paddingLeft: '15px',
                      background: 'rgb(244, 245, 249)'
                  }}
                  value={props.mobileCountry}
                  onChange={props.onCountryCodeChange}/>

        <input className="full-input" type="text"
               placeholder={Resources.getInstance().profilePhoneHolder}
               value={props.new_phone || ''}
               onChange={props.handleContactChange}
               name='phone'/>
    </div>
    <div className="two-items">
        <input className="left-input" type="text"
               placeholder={Resources.getInstance().profilePhoneLabel}
               value={props.code || ''}
               onChange={props.handleCodeChange}
               name='code'/>
        <button
            style={props.waitSec || !props.mobileValid || !props.new_phone ? {
                    color: '#fff',
                    background: '#dfdfe4'
                } : {
                    color: 'white'
                }}
            disabled={!props.mobileValid || props.waitSec > 0 || !props.new_phone}
            onClick={props.sms}
        >{props.waitSec ? Resources.getInstance().profilePhoneSend + '(' + props.waitSec + ')' :
                ( props.send ? Resources.getInstance().profilePhoneCheckAgain : Resources.getInstance().profilePhoneCheck)}
        </button>
    </div>
    <Button50px
        disabled={!props.mobileValid || props.code.length !== 4}
        text={Resources.getInstance().validate}
        submit={props.modifyCheck}/>
</div>)
