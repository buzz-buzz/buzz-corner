import Resources from '../../resources';
import React from 'react';
import {Dropdown, Form} from 'semantic-ui-react';
import {MemberType} from "../../membership/member-type";
import { zones } from 'moment-timezone/data/meta/latest.json';
import { countries } from 'moment-timezone/data/meta/latest.json';

const grade_list = [
    {key: '1', value: '1', text: Resources.getInstance().gradeOne},
    {key: '2', value: '2', text: Resources.getInstance().gradeTwo},
    {key: '3', value: '3', text: Resources.getInstance().gradeThr},
    {key: '4', value: '4', text: Resources.getInstance().gradeFou},
    {key: '5', value: '5', text: Resources.getInstance().gradeFiv},
    {key: '6', value: '6', text: Resources.getInstance().gradeSix},
    {key: '7', value: '7', text: Resources.getInstance().gradeSev},
    {key: '8', value: '8', text: Resources.getInstance().gradeEig},
    {key: '9', value: '9', text: Resources.getInstance().gradeNin},
];

const grade_list_foreign = [
    {key: '1', value: '1', text: 'Grade 1'},
    {key: '2', value: '2', text: 'Grade 2'},
    {key: '3', value: '3', text: 'Grade 3'},
    {key: '4', value: '4', text: 'Grade 4'},
    {key: '5', value: '5', text: 'Grade 5'},
    {key: '6', value: '6', text: 'Grade 6'},
    {key: '7', value: '7', text: 'Grade 7'},
    {key: '8', value: '8', text: 'Grade 8'},
    {key: '9', value: '9', text: 'Grade 9'},
    {key: '10', value: '10', text: 'Grade 10'},
    {key: '11', value: '11', text: 'Grade 11'},
    {key: '12', value: '12', text: 'Grade 12'},
];

const city_list = [
    {key: '0', value: '其他', text: Resources.getInstance().cityQT},
    {key: '1', value: '北京', text: Resources.getInstance().cityBJ},
    {key: '2', value: '上海', text: Resources.getInstance().citySH},
    {key: '3', value: '广州', text: Resources.getInstance().cityGZ},
    {key: '4', value: '深圳', text: Resources.getInstance().citySZ},
    {key: '5', value: '天津', text: Resources.getInstance().cityTJ},
    {key: '6', value: '杭州', text: Resources.getInstance().cityHZ},
    {key: '7', value: '南京', text: Resources.getInstance().cityNJ},
    {key: '8', value: '济南', text: Resources.getInstance().cityJN},
    {key: '9', value: '重庆', text: Resources.getInstance().cityCQ},
    {key: '10', value: '青岛', text: Resources.getInstance().cityQD},
    {key: '11', value: '大连', text: Resources.getInstance().cityDL},
    {key: '12', value: '宁波', text: Resources.getInstance().cityNB},
    {key: '13', value: '厦门', text: Resources.getInstance().cityXM},
    {key: '14', value: '重庆', text: Resources.getInstance().cityCQ},
    {key: '15', value: '成都', text: Resources.getInstance().cityCD},
    {key: '16', value: '武汉', text: Resources.getInstance().cityWH},
    {key: '17', value: '哈尔滨', text: Resources.getInstance().cityHEB},
    {key: '18', value: '沈阳', text: Resources.getInstance().citySY},
    {key: '19', value: '西安', text: Resources.getInstance().cityXA},
    {key: '20', value: '长春', text: Resources.getInstance().cityCC},
    {key: '21', value: '长沙', text: Resources.getInstance().cityCS},
    {key: '22', value: '福州', text: Resources.getInstance().cityFZ},
    {key: '23', value: '郑州', text: Resources.getInstance().cityZZ},
    {key: '24', value: '石家庄', text: Resources.getInstance().citySJZ},
    {key: '25', value: '苏州', text: Resources.getInstance().citySZ1},
    {key: '26', value: '佛山', text: Resources.getInstance().cityFS},
    {key: '27', value: '东莞', text: Resources.getInstance().cityDG},
    {key: '28', value: '无锡', text: Resources.getInstance().cityWX},
    {key: '29', value: '烟台', text: Resources.getInstance().cityYT},
    {key: '30', value: '太原', text: Resources.getInstance().cityTY},
    {key: '31', value: '合肥', text: Resources.getInstance().cityHF},
    {key: '32', value: '南昌', text: Resources.getInstance().cityNC},
    {key: '33', value: '南宁', text: Resources.getInstance().cityNN},
    {key: '34', value: '昆明', text: Resources.getInstance().cityKM},
    {key: '35', value: '温州', text: Resources.getInstance().cityWZ},
    {key: '36', value: '淄博', text: Resources.getInstance().cityZB},
    {key: '37', value: '唐山', text: Resources.getInstance().cityTS},
];

const timeZones = Object.keys(zones).map(key=>({
    key, value: key, text: key
}));

let countryList = Object.keys(countries).map(key=>({
    key, value: countries[key].name, text: countries[key].name
}));

const birthdayFrom = (new Date().getFullYear() - 7) + '-' + (new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1 ) ) + '-' + (new Date().getDate() > 9 ?  new Date().getDate() : '0' + new Date().getDate() );

export default class ProfileFormStep2 extends React.Component {
    render() {
        return (
            this.props.role === MemberType.Student
                ?
                (<div className="form-content">
                    <div className="parents-name">
                        <input type="text"
                               placeholder={Resources.getInstance().profileChildName}
                               style={{width: '100%'}}
                               value={this.props.profile.student_en_name}
                               onChange={this.props.handleChange}
                               name='student_en_name'/>
                    </div>
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
                    <Form.Group widths='equal' className="position-relative">
                        <Form.Input
                            style={this.props.profile.date_of_birth ? {opacity: '1'} : {opacity: '0'}}
                            value={this.props.profile.date_of_birth || birthdayFrom} type="date"
                            onChange={this.props.handleChange} name='date_of_birth'/>
                        <div className="field birthday-label">
                            <input type="text"
                                   placeholder={Resources.getInstance().profileBirth}
                                   style={{width: '100%'}}
                                   value={this.props.birthdayLabel || ''}
                                   onChange={this.props.handleChangeBirthdayLabel}
                                   name='birthdayLabel'/>
                        </div>
                    </Form.Group>
                    <div className="selection-options">
                        <Dropdown placeholder={Resources.getInstance().profileCity} search
                                  selection noResultsMessage="没有这个城市哦"
                                  onChange={(event, data) => {
                                      this.props.handleCityChange(event, data)
                                  }} value={this.props.profile.city}
                                  options={city_list}/>
                        <Dropdown placeholder={Resources.getInstance().profileGrade} search
                                  selection noResultsMessage="例如: 六年级"
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
                            <Form.Group widths='equal' className="position-relative">
                                <Form.Input
                                    style={this.props.profile.date_of_birth ? {opacity: '1'} : {opacity: '0'}}
                                    value={this.props.profile.date_of_birth || birthdayFrom} type="date"
                                    onChange={this.props.handleChange} name='date_of_birth'/>
                                <div className="field birthday-label">
                                    <input type="text"
                                           placeholder="birthday"
                                           style={{width: '100%'}}
                                           value={this.props.birthdayLabel || ''}
                                           onChange={this.props.handleChangeBirthdayLabel}
                                           name='birthdayLabel'/>
                                </div>
                            </Form.Group>
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
                            <div className="parents-name">
                                <input type="text" placeholder="School Information"
                                       style={{width: '100%'}}
                                       value={this.props.profile.school}
                                       onChange={this.props.handleChange}
                                       name='school'/>
                            </div>
                        </div> : <div></div>
                )
        )
    }
}