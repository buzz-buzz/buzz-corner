import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {MemberType} from "../membership/member-type";
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import ButtonBottom from '../common/commonComponent/submitButtonRadius10Px';
import './select.css';

class SelectRole extends Component {
    constructor(props){
        super(props);

        this.state = {
            role: props.location.query.intro || '',
            role_data: [
                {
                    name: 'I\'m a Tutor',
                    role: MemberType.Companion,
                    intro1: 'I love talk with people',
                    intro2: 'I think I can make friend with chinese kids and improve their English together.',
                    img: 'https://cdn-corner.resource.buzzbuzzenglish.com/icon_world.svg',
                    img_active: 'https://cdn-corner.resource.buzzbuzzenglish.com/icon_world_active.svg'
                },
                {
                    name: '我是中国少年',
                    role: MemberType.Student,
                    intro1: '我喜欢学习英语，用英语了解世界。',
                    intro2: '和世界各地的伙伴成为朋友共同成长。',
                    img: 'https://cdn-corner.resource.buzzbuzzenglish.com/icon_china.svg',
                    img_active: 'https://cdn-corner.resource.buzzbuzzenglish.com/icon_china_active.svg'
                }
            ]
        }

        this.toggleRole = this.toggleRole.bind(this);
    }

    toggleRole(role){
        if(this.state.role !== role){
            this.setState({role: role});
        }
    }

    render() {
        return (
            <div className="select-role">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <div className="page-title">
                    点击选择你的角色
                </div>
                {
                    this.state.role_data.map((item, index) => <div
                        className={ item.role === this.state.role ? "item-role item-role-active" : "item-role"}
                        onClick={()=>this.toggleRole(item.role)}
                        key={index}>
                        <img src={ item.role === this.state.role ? item.img_active : item.img} alt=""/>
                        <div className="role-name">{item.name}</div>
                        <div className="role-intro">
                            <p>{item.intro1}</p>
                            <p>{item.intro2}</p>
                        </div>
                    </div>)
                }
                <div className="btn">
                    <ButtonBottom
                        disabled={!this.state.role}
                        text={Resources.getInstance().loginNextStep}
                        submit={this.submit}/>
                </div>
            </div>
        );
    }
}

export default SelectRole;