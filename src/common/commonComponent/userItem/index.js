import React, {Component} from 'react';
import {Flag} from 'semantic-ui-react';
import Avatar from '../avatar';
import Resources from '../../../resources';
import {GradeData} from "../../systemData/gradeData";
import BirthdayHelper from '../../birthdayFormat';
import './index.css';

export default class UserItem extends Component{
    getGradeName(grade){
        let result = '';

        for(let i in GradeData.grade_list){
            if(GradeData.grade_list[i].value === grade){
                result = GradeData.grade_list[i].text;
                break;
            }
        }

        if(!result){
            for(let i in GradeData.grade_list_foreign){
                if(GradeData.grade_list_foreign[i].value === grade){
                    result = GradeData.grade_list_foreign[i].text;
                    break;
                }
            }
        }

        return result;
    }

    render(){
        return (
            <div className="user-item" style={this.props.active === this.props.user_id ? {border: '1px solid #f6b40c'} : {}}
                 onClick={(event) => this.props.selectUser(event, this.props.user_id)} >
                <div className="user-item-avatar">
                    <Avatar width="70px" height="70px"
                        src={this.props.data.avatar ||  '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}/>
                    <Flag
                        name={this.props.data.country ? this.props.data.country.toLowerCase() : 'united states'}/>
                </div>
                <div className="user-item-info">
                    <p className="your-name" style={{
                        fontWeight: '500',
                        fontSize: '15px',
                        color: '#000'
                    }}>{this.props.data.name}</p>
                    <p className="gender-birthday" style={{
                        color: '#666',
                        fontSize: '11px'
                    }}>{this.props.data.gender === 'f' ? Resources.getInstance().profileFemale : Resources.getInstance().profileMale}&nbsp;&nbsp;&nbsp;&nbsp;{BirthdayHelper.getBirthdayFromDbFormat(this.props.data.date_of_birth)}</p>
                    <p className="city-grade"
                       style={{fontSize: '11px', color: '#666'}}>{this.props.data.city || this.props.data.country}&nbsp;&nbsp;&nbsp;&nbsp;{this.getGradeName(this.props.data.grade)}</p>
                </div>
            </div>
        )
    }
}