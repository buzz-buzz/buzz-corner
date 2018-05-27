import Resources from '../../resources';
import React from 'react';
import {Dropdown, Form} from 'semantic-ui-react';
import {MemberType} from "../../membership/member-type";
import { zones } from 'moment-timezone/data/meta/latest.json';
import { countries } from 'moment-timezone/data/meta/latest.json';
import {GradeData} from "../../common/systemData/gradeData";
import {ChineseCityList} from "../../common/systemData/chineseCityListData";
import BuzzInput from '../../common/commonComponent/buzzInput';
import Client from "../../common/client";
//import moment from 'moment-timezone'
//import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

const grade_list = GradeData.grade_list;

const grade_list_foreign = GradeData.grade_list_foreign;

const timeZones = Object.keys(zones).map(key=>({
    key, value: key, text: key
}));

const countryList = Object.keys(countries).map(key=>({
    key, value: countries[key].name, text: countries[key].name
}));

const YearList = [];
const MonthList = [];
const DateList = [];

const minYear = parseFloat(new Date().getFullYear()) - 100;
const maxYear = parseFloat(new Date().getFullYear());
const maxMonth = 12;
const maxDate = 31;

for(let i = maxYear; i >= minYear; i--){
    YearList.push({key: i + '', value: i + '', text: i + ''});
}

for(let i = 1; i <= maxMonth; i++){
    let new_i;
    new_i = i > 9 ? i + '' : '0' + i;
    MonthList.push({key: new_i, value: new_i, text: new_i});
}

for(let i = 1; i <= maxDate; i++){
    let new_i;
    new_i = i > 9 ? i + '' : '0' + i;
    DateList.push({key: new_i, value: new_i, text: new_i});
}

const birthdayFrom = (new Date().getFullYear() - 7) + '-' + (new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1 ) ) + '-' + (new Date().getDate() > 9 ?  new Date().getDate() : '0' + new Date().getDate() );

export default class ProfileFormStep2 extends React.Component {
    render() {
        return (
            this.props.role === MemberType.Student
                ?
                (<div className="form-content">
                    <BuzzInput type="text" placeholder={Resources.getInstance().profileChildName}
                               value={this.props.profile.student_en_name}
                               onChange={this.props.handleChange}
                               name='student_en_name'
                    />
                    <div className="gender">
                        <div className="male" onClick={this.props.changeGenderMale}>
                            <div
                                className={this.props.profile.gender === 'm' ? 'avatar active' : 'avatar'}>
                                <img
                                    src={this.props.profile.gender === 'm'? '//cdn-corner.resource.buzzbuzzenglish.com/icon_boy_active1.svg' : '//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_boy.svg'}
                                    alt=""/>
                            </div>
                            <span
                                style={this.props.profile.gender === 'm' ? {color: '#f7b52a'} : {}}>{Resources.getInstance().profileMale}</span>
                        </div>
                        <div className="female" onClick={this.props.changeGenderFemale}>
                            <div
                                className={this.props.profile.gender === 'f' ? 'avatar active' : 'avatar'}>
                                <img
                                    src={this.props.profile.gender === 'f'? '//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_girl_active.svg' : '//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_girl.svg'}
                                    alt=""/>
                            </div>
                            <span
                                style={this.props.profile.gender === 'f' ? {color: '#f7b52a'} : {}}>{Resources.getInstance().profileFemale}</span>
                        </div>
                    </div>
                    {
                        Client.getClient() === 'phone' ?
                            <Form.Group widths='equal' className="position-relative">
                                <Form.Input
                                    style={this.props.profile.date_of_birth ? {opacity: '1'} : {opacity: '0'}}
                                    value={this.props.profile.date_of_birth || birthdayFrom} type="date"
                                    onChange={this.props.handleChange} name='date_of_birth'/>
                                <div className="field birthday-label">
                                    <BuzzInput type="text" placeholder={Resources.getInstance().profileBirth}
                                               value={this.props.birthdayLabel || ''}
                                               onChange={this.props.handleChangeBirthdayLabel}
                                               name='birthdayLabel'
                                    />
                                </div>
                            </Form.Group> :
                            <div className="tablet-birth">
                                <Dropdown placeholder={Resources.getInstance().profileBirthdayYearHolder}
                                          selection
                                          onChange={(event, data) => {
                                              this.props.handleTabletYear(event, data)
                                          }} value={this.props.tabletBirth.year || ''}
                                          options={YearList}/>
                                <Dropdown placeholder={Resources.getInstance().profileBirthdayMonthHolder}
                                          selection
                                          onChange={(event, data) => {
                                              this.props.handleTabletMonth(event, data)
                                          }} value={this.props.tabletBirth.month || ''}
                                          options={MonthList}/>
                                <Dropdown placeholder={Resources.getInstance().profileBirthdayDayHolder}
                                          selection
                                          onChange={(event, data) => {
                                              this.props.handleTabletDate(event, data)
                                          }} value={this.props.tabletBirth.date || ''}
                                          options={DateList}/>
                            </div>
                    }
                    {/*<Form.Group widths='equal' className="position-relative">*/}
                        {/*<div className="field birthday-label-style">*/}
                            {/*<DatePicker*/}
                                {/*selected={this.props.profile.date_of_birth ? moment(this.props.tablet_birth) : null}*/}
                                {/*onChange={this.props.handleBirthdayChange} syle={{height: '50px'}}*/}
                                {/*dateFormat={"YYYY-MM-DD"} placeholderText={Resources.getInstance().profileBirth}*/}
                                {/*isClearable={false} peekNextMonth*/}
                                {/*showMonthDropdown*/}
                                {/*showYearDropdown*/}
                                {/*dropdownMode="select" />*/}
                        {/*</div>*/}
                        {/*<div className="field birthday-label">*/}
                            {/*<BuzzInput type="text" placeholder={Resources.getInstance().profileBirth}*/}
                                       {/*value={this.props.birthdayLabel || ''}*/}
                                       {/*onChange={this.props.handleChangeBirthdayLabel}*/}
                                       {/*name='birthdayLabel' height="50px"*/}
                            {/*/>*/}
                        {/*</div>*/}
                    {/*</Form.Group>*/}
                    <div className="selection-options">
                        <Dropdown placeholder={Resources.getInstance().profileCity} search
                                  selection noResultsMessage="no result"
                                  onChange={(event, data) => {
                                      this.props.handleCityChange(event, data)
                                  }} value={this.props.profile.city}
                                  options={ChineseCityList}/>
                        <Dropdown placeholder={Resources.getInstance().profileGrade} search
                                  selection noResultsMessage="no result"
                                  onChange={(event, data) => {
                                      this.props.handleGradeChange(event, data)
                                  }} value={this.props.profile.grade}
                                  options={grade_list}/>
                    </div>
                </div>)
                : ( this.props.role === MemberType.Companion ?
                        <div className="form-content">
                            <div className="gender">
                                <div className="male" onClick={this.props.changeGenderMale}>
                                    <div
                                        className={this.props.profile.gender === 'm' ? 'avatar active' : 'avatar'}>
                                        <img
                                            src={this.props.profile.gender === 'm'? '//cdn-corner.resource.buzzbuzzenglish.com/icon_boy_active1.svg' : '//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_boy.svg'}
                                            alt=""/>
                                    </div>
                                    <span
                                        style={this.props.profile.gender === 'm' ? {color: '#f7b52a'} : {}}>Boy</span>
                                </div>
                                <div className="female" onClick={this.props.changeGenderFemale}>
                                    <div
                                        className={this.props.profile.gender === 'f' ? 'avatar active' : 'avatar'}>
                                        <img
                                            src={this.props.profile.gender === 'f'? '//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_girl_active.svg' : '//cdn-corner.resource.buzzbuzzenglish.com/image/icon/icon_girl.svg'}
                                            alt=""/>
                                    </div>
                                    <span
                                        style={this.props.profile.gender === 'f' ? {color: '#f7b52a'} : {}}>Girl</span>
                                </div>
                            </div>
                            {
                                Client.getClient() === 'phone' ?
                                    <Form.Group widths='equal' className="position-relative">
                                        <Form.Input
                                            style={this.props.profile.date_of_birth ? {opacity: '1'} : {opacity: '0'}}
                                            value={this.props.profile.date_of_birth || birthdayFrom} type="date"
                                            onChange={this.props.handleChange} name='date_of_birth'/>
                                        <div className="field birthday-label">
                                            <BuzzInput type="text" placeholder={Resources.getInstance().profileBirth}
                                                       value={this.props.birthdayLabel || ''}
                                                       onChange={this.props.handleChangeBirthdayLabel}
                                                       name='birthdayLabel'
                                            />
                                        </div>
                                    </Form.Group> :
                                    <div className="tablet-birth">
                                        <Dropdown placeholder={Resources.getInstance().profileBirthdayYearHolder}
                                                  selection
                                                  onChange={(event, data) => {
                                                      this.props.handleTabletYear(event, data)
                                                  }} value={this.props.tabletBirth.year || ''}
                                                  options={YearList}/>
                                        <Dropdown placeholder={Resources.getInstance().profileBirthdayMonthHolder}
                                                  selection
                                                  onChange={(event, data) => {
                                                      this.props.handleTabletMonth(event, data)
                                                  }} value={this.props.tabletBirth.month || ''}
                                                  options={MonthList}/>
                                        <Dropdown placeholder={Resources.getInstance().profileBirthdayDayHolder}
                                                  selection
                                                  onChange={(event, data) => {
                                                      this.props.handleTabletDate(event, data)
                                                  }} value={this.props.tabletBirth.date || ''}
                                                  options={DateList}/>
                                    </div>
                            }
                            <div className="selection-options" style={{height: '50px', boxSizing: 'border-box', marginBottom: '10px'}}>
                                <Dropdown placeholder="Grade" search
                                          selection noResultsMessage="eg: grade 1"
                                          onChange={(event, data) => {
                                              this.props.handleGradeChange(event, data)
                                          }} value={this.props.profile.grade}
                                          options={grade_list_foreign}/>
                            </div>
                            <div className="selection-options" style={{height: '50px', boxSizing: 'border-box', marginBottom: '10px'}}>
                                <Dropdown placeholder="Time zone" search
                                          selection noResultsMessage="eg: Asia/Shanghai"
                                          onChange={(event, data) => {
                                              this.props.handleTimeZoneChange(event, data)
                                          }} value={this.props.profile.time_zone}
                                          options={timeZones}/>
                            </div>
                            <div className="selection-options" style={{height: '50px', boxSizing: 'border-box', marginBottom: '10px'}}>
                                <Dropdown placeholder="Country" search
                                          selection noResultsMessage="eg: China"
                                          onChange={(event, data) => {
                                              this.props.handleCountryChange(event, data)
                                          }} value={this.props.profile.country}
                                          options={countryList}/>
                            </div>
                            <BuzzInput type="text" placeholder="School Information"
                                       value={this.props.profile.school}
                                       onChange={this.props.handleChange}
                                       name='school'
                            />
                        </div> : <div></div>
                )
        )
    }
}