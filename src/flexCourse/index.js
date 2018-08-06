import React from 'react';
import SelectDay from './selectDate';
import CourseList from './courseList';
import Footer from '../layout/footer';
import CurrentUser from "../membership/user";
import {MemberType} from "../membership/member-type";
import ServiceProxy from '../service-proxy';
import Track from "../common/track";
import ErrorHandler from "../common/error-handler";
import moment from "moment/moment";
import './index.css';

export default class FlexCourse extends React.Component {
    constructor() {
        super();

        let days = [];
        for (let i = 1; i <= 7; i++) {
            days.push({
                date: moment().add(i, 'd').format("DD"),
                day: moment().add(i, 'd').format("ddd").toLocaleUpperCase(),
                active: 0,
                month_year: moment().add(i, 'd').format("MMM YYYY"),
                format_date: moment().add(i, 'd').hour(0).minute(0).second(0).millisecond(0).toISOString()
            });
        }

        this.state = {
            days: days,
            active_day: days[0],
            courseList: []
        };

        this.switchDay = this.switchDay.bind(this);
    }

    switchDay(index) {
        Track.event('淘课_日期切换点击');

        if (!this.state.days[index].active) {
            let clonedDays = this.state.days.slice();
            for (let i in clonedDays) {
                if (clonedDays[i].active) {
                    clonedDays[i].active = 0;
                }
            }
            clonedDays[index].active = 1;
            this.setState({
                days: clonedDays,
                active_day: clonedDays[index]
            }, async() => {
                //update course data
                this.setState({loadingCourse: true});
                await this.updateCourseListByUserId(this.state.user_id, clonedDays[index].format_date);
            });
        }
    }


    async updateCourseListByUserId(user_id, date) {
        try {
            let courseList = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/optional?user_id=${user_id}&date=${date}`
                }
            });

            if (courseList && courseList.length) {
                this.setState({courseList: courseList, loadingCourse: false});
            } else {
                this.setState({courseList: [], loadingCourse: false});
            }
        }
        catch (ex) {
            ErrorHandler.notify('更新淘课列表出错', ex);
            this.setState({courseList: [], loadingCourse: false});
        }
    }

    async getLatestCourse(user_id, dates) {
        let courseList = [], index = 0;

        for (let i in dates) {
            let courseListData = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/optional?user_id=${user_id}&date=${dates[i].format_date}`
                }
            });

            if (courseListData && courseListData.length) {
                courseList = courseListData;
                index = i;
                dates[i].active = 1;
                break;
            }
        }

        if (index === 0) {
            dates[0].active = 0;
        }

        this.setState({courseList: courseList, loadingCourse: false, active_day: dates[index]});
    }

    async componentWillMount() {
        try {
            Track.event('淘课_页面展示');

            this.setState({loadingCourse: true});

            let profile = await CurrentUser.getProfile();
            let userId = profile.user_id;

            this.setState({user_id: userId});

            await this.getLatestCourse(userId, this.state.days);
        }
        catch (ex) {
            ErrorHandler.notify('淘课页面出错', ex);
        }
    }

    render() {
        return (
            <div className="flex-course">
                <SelectDay switchDay={this.switchDay} days={this.state.days} activeDay={this.state.active_day}/>
                <CourseList data={this.state.courseList} loading={this.state.loadingCourse}/>
                <Footer role={MemberType.Student}/>
            </div>
        )
    }
}