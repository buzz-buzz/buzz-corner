import React, { Component } from 'react';
import { Flag } from 'semantic-ui-react';
import Avatar from '../avatar';
import Resources from '../../../resources';
import { GradeData } from "../../../common/systemData/gradeData";
import './index.css';

function getBirthDay(date_of_birth) {
    if (date_of_birth) {
        let date = new Date(date_of_birth);
        return String(date.getFullYear()) + '-' + String(date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + String(date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
    } else {
        return ''
    }
}

export default class UserItem extends Component {
    getGradeName(grade) {
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
            <div className="user-item" style={this.props.active === this.props.user.user_id ? { border: '1px solid #f6b40c' } : {}}
                onClick={(event) => this.props.selectUser(event, this.props.user.user_id)} >
                <div className="user-item-avatar">
                    <Avatar width="70px" height="70px"
                        src={this.props.user.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'} />
                    <Flag
                        name={this.props.user.country ? this.props.user.country.toLowerCase() : 'united states'} />
                </div>
                <div className="user-item-info">
                    <p className="your-name" style={{
                        fontWeight: '500',
                        fontSize: '15px',
                        color: '#000'
                    }}>{this.props.user.name}</p>
                    <p className="gender-birthday" style={{
                        color: '#666',
                        fontSize: '11px'
                    }}>{this.props.user.gender === 'f' ? Resources.getInstance().profileFemale : Resources.getInstance().profileMale}&nbsp;&nbsp;&nbsp;&nbsp;{getBirthDay(this.props.user.date_of_birth)}</p>
                    <p className="city-grade"
                        style={{ fontSize: '11px', color: '#666' }}>{this.props.user.city || this.props.user.country}&nbsp;&nbsp;&nbsp;&nbsp;{this.getGradeName(this.props.user.grade)}</p>
                </div>
            </div>
        )
    }
}