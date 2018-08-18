import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import {MemberType} from "../membership/member-type";
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import URLHelper from "../common/url-helper";
import ButtonBottom from '../common/commonComponent/submitButtonRadius10Px';
import ErrorHandler from "../common/error-handler";
import './select.css';

class SelectRole extends Component {
    constructor(props){
        super(props);

        this.state = {
            loadingModal: true,
            role: props.location.query.role || '',
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
        };

        this.toggleRole = this.toggleRole.bind(this);
        this.submit = this.submit.bind(this);
    }

    toggleRole(role){
        if(this.state.role !== role){
            this.setState({role: role});
        }
    }

    async componentWillMount(){
        try{
            let profile = await CurrentUser.getProfile();

            if(!profile.user_id){
                browserHistory.push(`/login?return_url=${URLHelper.getSearchParam(window.location.search, 'return_url')}`);
            }else{
                this.setState({loadingModal: false});
            }
        }
        catch (ex){
            browserHistory.push(`/login?return_url=${URLHelper.getSearchParam(window.location.search, 'return_url')}`);
        }
    }

    async submit(){
        try{
            this.setState({loadingModal: true});

            await CurrentUser.updateProfile({role: this.state.role});

            let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url');

            if (returnUrl) {
                browserHistory.push(decodeURIComponent(returnUrl));
                //window.location.href = decodeURIComponent(returnUrl);
            } else {
                browserHistory.push('/');
            }
        }
        catch (ex){
            this.setState({loadingModal: true});

            ErrorHandler.notify('网络请求发生错误', ex);
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