import React from 'react';
import {browserHistory} from 'react-router';
import CurrentUser from "../../membership/user";
import Button50Px from '../../common/commonComponent/submitButton50px';
import CourseModal from '../courseModal';
import ErrorHandler from "../../common/error-handler";
import LoadingModal from '../../common/commonComponent/loadingModal';
import ClassInfoTitle from '../../classDetail/classInfoTitle';
import TimeHelper from '../../common/timeHelper';
import Resources from '../../resources';
import ServiceProxy from '../../service-proxy';
import Track from "../../common/track";
import './index.css';

export default class CourseDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            class_id: props.params.class_id,
            course_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [],
                status: "",
                show_date: 'tomorrow, is coming',
                companions: '',
                start_time: new Date(),
                end_time: new Date(),
                class_status_show_word: '今天开始',
                students: [],
                left: 0
            },
            courseModal: false,
            user_list: [],
            class_hours: 0
        };

        this.joinCourse = this.joinCourse.bind(this);
        this.showHtml = this.showHtml.bind(this);
        this.joinClass = this.joinClass.bind(this);
        this.joinCancel = this.joinCancel.bind(this);
        this.joinHelp = this.joinHelp.bind(this);
        this.joinSuccess = this.joinSuccess.bind(this);
    }

    joinCourse() {
        Track.event('淘课_报名按钮点击');

        if (this.state.class_hours >= this.state.course_info.class_hours) {
            this.setState({
                courseModal: true,
                courseType: 'before',
                courseOk: true
            });
        } else {
            this.setState({
                courseModal: true,
                courseType: 'before',
                courseOk: false
            });
        }
    }

    async joinClass() {
        try {
            Track.event('淘课_确认参加点击');

            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/joinOptional/${this.state.class_id}?user_id=${this.state.user_id}`,
                    method: 'POST'
                }
            });

            let classInfo = this.state.course_info;

            if (classInfo.students.indexOf(this.state.user_id) === -1) {
                classInfo.students.push(this.state.user_id);
            }

            this.setState({
                courseModal: true,
                courseType: 'result',
                courseOk: true,
                err: '',
                course_info: classInfo
            });
        }
        catch (ex) {
            Track.event('淘课_报名失败', ex.result || '');

            this.dealWithErr(ex.result);
        }
    }

    dealWithErr(msg) {
        switch (msg) {
            case 'Error: invalid class hours':
                this.setState({
                    courseModal: true,
                    courseType: 'before',
                    courseOk: false
                });
                break;
            case 'Error: invalid class':
                this.setState({
                    courseModal: true,
                    courseType: 'result',
                    courseOk: false,
                    err: ''
                });
                break;
            case 'Error: invalid user_id':
                this.setState({
                    courseModal: true,
                    courseType: 'result',
                    courseOk: false,
                    err: Resources.getInstance().taoCourseUseridNone
                });
                break;
            case 'Error: invalid date':
                this.setState({
                    courseModal: true,
                    courseType: 'result',
                    courseOk: false,
                    err: Resources.getInstance().taoCourseDateValid
                });
                break;
            case 'Error: invalid grade':
                this.setState({
                    courseModal: true,
                    courseType: 'result',
                    courseOk: false,
                    err: Resources.getInstance().taoCourseGradeUseless
                });
                break;
            default:
                this.setState({
                    courseModal: true,
                    courseType: 'result',
                    courseOk: false,
                    err: msg || Resources.getInstance().emailSendWrong
                });
        }
    }

    joinCancel() {
        Track.event('淘课_暂不参加点击');

        this.setState({
            courseModal: false
        });
    }

    joinHelp() {
        Track.event('淘课_咨询购买点击');

        browserHistory.push('/help/purchase_class_hour');
    }

    joinSuccess() {
        Track.event('淘课_报名成功点击');

        browserHistory.push(`/class/${this.state.class_id}?back=course`);
    }

    async componentWillMount() {
        try {
            Track.event('淘课_详情页面展示');

            this.setState({loadingModal: true});

            let courseInfo = await this.getCourseInfoByClassId(this.state.class_id), userList = [], class_content = {};
            let profile = await CurrentUser.getProfile();

            if (courseInfo && courseInfo.length) {
                courseInfo[0].students = courseInfo[0].students ? courseInfo[0].students.split(',') : [];
                userList = await this.getUserListInfo(courseInfo[0].students);
                class_content = await this.getCourseContent(courseInfo[0], profile.level);
                courseInfo[0].left = this.getTimeLeft(courseInfo[0]);
                courseInfo[0].class_status_show_word = TimeHelper.timeDiff(new Date(courseInfo[0].start_time), new Date(courseInfo[0].end_time), new Date(courseInfo[0].CURRENT_TIMESTAMP || new Date()), window.navigator.language);
            }

            this.setState({
                loadingModal: false,
                course_info: courseInfo.length ? courseInfo[0] : {},
                user_list: userList,
                user_id: profile.user_id,
                class_content: class_content,
                class_hours: profile.class_hours || 0
            });
        }
        catch (ex) {
            ErrorHandler.notify('淘课详情页出错', ex);
            this.setState({loadingModal: false});
        }
    }

    getTimeLeft(classInfo) {
        let ent_time = classInfo.end_time || classInfo.class_end_time || new Date();
        let now = classInfo.CURRENT_TIMESTAMP || new Date();

        let left = Math.floor((new Date(ent_time).getTime() - new Date(now).getTime()) / 1000), days, hours, minutes;
        days = Math.floor(left / (3600 * 24));
        hours = Math.floor((left - days * 3600 * 24) / 3600);
        minutes = Math.floor((left - days * 3600 * 24 - hours * 3600) / 60);

        if (left > 0) {
            return (days > 9 ? days : '0' + days) + 'd ' + (hours > 9 ? hours : '0' + hours) + 'h ' + (minutes > 9 ? minutes : '0' + minutes) + 'm';
        } else {
            return 0;
        }
    }

    async getCourseInfoByClassId(class_id) {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/class-schedule/${class_id}`
            }
        });
    }

    async getCourseContent(class_info, level) {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/content/getByClassAndUser`,
                qs: {
                    module: class_info.module || null,
                    topic: class_info.topic || null,
                    topic_level: class_info.topic_level || null,
                    level: level || null
                }
            }
        });
    }

    async getUserListInfo(users) {
        let result = [];

        if (users && users.length) {
            for (let i in users) {
                let user_profile = await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${users[i]}?t=${new Date().getTime()}`
                    }
                });

                result.push({
                    name: user_profile.name || user_profile.wechat_name || user_profile.display_name,
                    avatar: user_profile.avatar || "//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg",
                    gender: user_profile.gender,
                    user_id: user_profile.user_id
                });
            }
        }

        return result;
    }

    showHtml(content) {
        return <div className="intro-content"
                    dangerouslySetInnerHTML={{__html: content}}/>;
    }

    render() {
        return (
            <div className="course-detail">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <ClassInfoTitle course_info={this.state.course_info}/>
                <div className="course-intro">
                    <div className="partners">
                        {
                            [0, 1, 2].map((item, index) => {
                                return this.state.user_list && this.state.user_list.length
                                && this.state.user_list[item] ?
                                    <div className="partner-item" key={index}>
                                        <div className="avatar">
                                            <img src={this.state.user_list[item].avatar} alt=""/>
                                        </div>
                                        <div className="name">
                                            <span>{this.state.user_list[item].name}</span>
                                            <img
                                                src={ this.state.user_list[item].gender === 'm' ?
                                                    "//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_men.svg"
                                                    : "//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_women.svg"
                                                }
                                                alt=""/>
                                        </div>
                                        {
                                            this.state.user_id === this.state.user_list[item].user_id &&
                                            <div className="status">
                                                <img
                                                    src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_Check_finish.svg"
                                                    alt=""/>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div className="partner-item" key={index}>
                                        <div className="avatar">
                                            <img src="" alt=""/>
                                        </div>
                                        <div className="name">
                                            <span style={{
                                                color: '#d0d6db',
                                                marginRight: '0'
                                            }}>{Resources.getInstance().taoCourseNoone}</span>
                                        </div>
                                    </div>
                            })
                        }
                    </div>
                    <div className="intro">
                        <div className="intro-title">{Resources.getInstance().taoCourseIntro}</div>
                        {
                            this.state.course_info.class_content && this.state.course_info.class_content.student_notice_zh ?
                                this.showHtml(window.navigator.language.toLowerCase() === 'zh-cn' ? this.props.content.student_notice_zh : this.props.content.student_notice_en)
                                :
                                <div className="intro-content">{Resources.getInstance().taoCourseIntroContent}</div>
                        }
                    </div>
                </div>
                <div className="course-join">
                    <div className="time-left">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/flex-course/icon_time.svg" alt=""/>
                        <div className="time">
                            <div className="word">{Resources.getInstance().taoCourseBegin}</div>
                            <div
                                className="time-down">{this.state.course_info.left ? this.state.course_info.left : Resources.getInstance().taoCourseSignNone}</div>
                        </div>
                    </div>
                    <div className="btn">
                        <Button50Px
                            disabled={ this.state.course_info.students.indexOf(this.state.user_id + '') !== -1 || !this.state.course_info.left }
                            submit={this.joinCourse}
                            text={ this.state.course_info.students.indexOf(this.state.user_id + '') === -1 ?
                                Resources.getInstance().taoCourseSignin : Resources.getInstance().taoCourseSigned}/>
                    </div>
                </div>
                {
                    this.state.courseModal &&
                    <CourseModal type={this.state.courseType} ok={this.state.courseOk}
                                 joinClass={this.joinClass} joinCancel={this.joinCancel}
                                 joinHelp={this.joinHelp} joinSuccess={this.joinSuccess}
                                 err={this.state.err} class_hours_need={this.state.course_info.class_hours || 1}
                    />
                }
            </div>
        )
    }
}