import React, {Component} from 'react';
import {Flag} from 'semantic-ui-react';
import Avatar from '../avatar';
import Resources from '../../../resources';
import {GradeData} from "../../../common/systemData/gradeData";
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
                        src="https://buzz-corner.user.resource.buzzbuzzenglish.com/Fkg6KH2vB8Eu1Hnl7rH9cNP14CAq?imageView2/1/w/400/h/400"/>
                    <Flag
                        name={this.props.data.country || 'united states'}/>
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
                    }}>{this.props.data.gender === 'f' ? Resources.getInstance().profileFemale : Resources.getInstance().profileMale}&nbsp;&nbsp;&nbsp;&nbsp;{this.props.data.birthday}</p>
                    <p className="city-grade"
                       style={{fontSize: '11px', color: '#666'}}>{this.props.data.city || ''}&nbsp;&nbsp;&nbsp;&nbsp;{this.getGradeName(this.props.data.grade)}</p>
                </div>
            </div>
        )
    }
}