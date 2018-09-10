import React, { Component } from 'react';
import Resources from '../../../resources';
import {GradeData} from "../../systemData/gradeData";
import BirthdayHelper from '../../birthdayFormat';
import './index.css';

export default class UserItem extends Component{
    getGradeName(grade){
        let result = '';

        for (let i in GradeData.grade_list) {
            if (GradeData.grade_list[i].value === grade) {
                result = GradeData.grade_list[i].text;
                break;
            }
        }

        if (!result) {
            for (let i in GradeData.grade_list_foreign) {
                if (GradeData.grade_list_foreign[i].value === grade) {
                    result = GradeData.grade_list_foreign[i].text;
                    break;
                }
            }
        }

        return result;
    }

    render() {
        return (
            <div className="user-item"
                onClick={(event) => this.props.selectUser(event, this.props.user.user_id)} >
                <div className="user-item-avatar">
                    <img
                        src={ this.props.user.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
                        alt=""/>
                </div>
                <div className="user-item-info">
                    <p className="your-name">{this.props.user.name}</p>
                    <p className="gender-birthday">{this.props.user.gender === 'f' ? Resources.getInstance().profileFemale : Resources.getInstance().profileMale}&nbsp;&nbsp;&nbsp;&nbsp;{BirthdayHelper.getBirthdayFromDbFormat(this.props.user.date_of_birth)}</p>
                    <p className="city-grade">{this.props.user.city || this.props.user.country}&nbsp;&nbsp;&nbsp;&nbsp;{this.getGradeName(this.props.user.grade)}</p>
                </div>
                <div className="status">
                    <img src={this.props.active === this.props.user.user_id ?
                        "//cdn-corner.resource.buzzbuzzenglish.com/icon_select_active.svg" :
                        "//cdn-corner.resource.buzzbuzzenglish.com/icon_select.svg"
                    } alt=""/>
                </div>
            </div>
        )
    }
}