import Resources from '../../resources';
import React from 'react';
import {Dropdown, Form} from 'semantic-ui-react';
import {MemberType} from "../../membership/member-type";

const grade_list = [
    {key: '1', value: '1', text: '一年级'},
    {key: '2', value: '2', text: '二年级'},
    {key: '3', value: '3', text: '三年级'},
    {key: '4', value: '4', text: '四年级'},
    {key: '5', value: '5', text: '五年级'},
    {key: '6', value: '6', text: '六年级'},
    {key: '7', value: '7', text: '七年级'},
    {key: '8', value: '8', text: '八年级'},
    {key: '9', value: '9', text: '九年级'},
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
    {key: '0', value: '其他', text: '其他'},
    {key: '1', value: '北京', text: '北京'},
    {key: '2', value: '上海', text: '上海'},
    {key: '3', value: '广州', text: '广州'},
    {key: '4', value: '深圳', text: '深圳'},
    {key: '5', value: '天津', text: '天津'},
    {key: '6', value: '杭州', text: '杭州'},
    {key: '7', value: '南京', text: '南京'},
    {key: '8', value: '济南', text: '济南'},
    {key: '9', value: '重庆', text: '重庆'},
    {key: '10', value: '青岛', text: '青岛'},
    {key: '11', value: '大连', text: '大连'},
    {key: '12', value: '宁波', text: '宁波'},
    {key: '13', value: '厦门', text: '厦门'},
    {key: '14', value: '重庆', text: '重庆'},
    {key: '15', value: '成都', text: '成都'},
    {key: '16', value: '武汉', text: '武汉'},
    {key: '17', value: '哈尔滨', text: '哈尔滨'},
    {key: '18', value: '沈阳', text: '沈阳'},
    {key: '19', value: '西安', text: '西安'},
    {key: '20', value: '长春', text: '长春'},
    {key: '21', value: '长沙', text: '长沙'},
    {key: '22', value: '福州', text: '福州'},
    {key: '23', value: '郑州', text: '郑州'},
    {key: '24', value: '石家庄', text: '石家庄'},
    {key: '25', value: '苏州', text: '苏州'},
    {key: '26', value: '佛山', text: '佛山'},
    {key: '27', value: '东莞', text: '东莞'},
    {key: '28', value: '无锡', text: '无锡'},
    {key: '29', value: '烟台', text: '烟台'},
    {key: '30', value: '太原', text: '太原'},
    {key: '31', value: '合肥', text: '合肥'},
    {key: '32', value: '南昌', text: '南昌'},
    {key: '33', value: '南宁', text: '南宁'},
    {key: '34', value: '昆明', text: '昆明'},
    {key: '35', value: '温州', text: '温州'},
    {key: '36', value: '淄博', text: '淄博'},
    {key: '37', value: '唐山', text: '唐山'},
];

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
                                    src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_boy.png"
                                    alt=""/>
                            </div>
                            <span
                                style={this.props.profile.gender === 'm' ? {color: '#f7b52a'} : {}}>{Resources.getInstance().profileMale}</span>
                        </div>
                        <div className="female" onClick={this.props.changeGenderFemale}>
                            <div
                                className={this.props.profile.gender === 'f' ? 'avatar active' : 'avatar'}>
                                <img
                                    src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_girl.png"
                                    alt=""/>
                            </div>
                            <span
                                style={this.props.profile.gender === 'f' ? {color: '#f7b52a'} : {}}>{Resources.getInstance().profileFemale}</span>
                        </div>
                    </div>
                    <Form.Group widths='equal' className="position-relative">
                        <Form.Input
                            style={this.props.profile.date_of_birth ? {opacity: '1'} : {opacity: '0'}}
                            value={this.props.profile.date_of_birth} type="date"
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
                                            src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_boy.png"
                                            alt=""/>
                                    </div>
                                    <span
                                        style={this.props.profile.gender === 'm' ? {color: '#f7b52a'} : {}}>Boy</span>
                                </div>
                                <div className="female" onClick={this.props.changeGenderFemale}>
                                    <div
                                        className={this.props.profile.gender === 'f' ? 'avatar active' : 'avatar'}>
                                        <img
                                            src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_girl.png"
                                            alt=""/>
                                    </div>
                                    <span
                                        style={this.props.profile.gender === 'f' ? {color: '#f7b52a'} : {}}>Girl</span>
                                </div>
                            </div>
                            <Form.Group widths='equal' className="position-relative">
                                <Form.Input
                                    style={this.props.profile.date_of_birth ? {opacity: '1'} : {opacity: '0'}}
                                    value={this.props.profile.date_of_birth} type="date"
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
                            <div className="parents-name">
                                <input type="text" placeholder="School Information"
                                       style={{width: '100%'}}
                                       value={this.props.profile.school}
                                       onChange={this.props.handleChange}
                                       name='school'/>
                            </div>
                            <div className="selection-options" style={{height: '50px', margin: '10px 0', boxSizing: 'border-box'}}>
                                <Dropdown placeholder="Grade" search
                                          selection noResultsMessage="eg: grade 1"
                                          onChange={(event, data) => {
                                              this.props.handleGradeChange(event, data)
                                          }} value={this.props.profile.grade}
                                          options={grade_list_foreign}/>
                            </div>
                            <div className="parents-name">
                                <input type="text" placeholder="Nationality"
                                       style={{width: '100%'}}
                                       value={this.props.profile.nationality}
                                       onChange={this.props.handleChange}
                                       name='nationality'/>
                            </div>
                        </div> : <div></div>
                )
        )
    }
}