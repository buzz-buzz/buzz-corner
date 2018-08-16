import React from 'react';
import SelectDay from './selectDate';
import CourseList from './courseList';
import Footer from '../layout/footer';
import CurrentUser from "../membership/user";
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
                day: this.chineseDay(moment().add(i, 'd').format("ddd").toLocaleUpperCase()),
                active: 0,
                month_year: moment().add(i, 'd').format("MMM YYYY"),
                format_date: moment().add(i, 'd').hour(0).minute(0).second(0).millisecond(0).toISOString()
            });
        }

        this.state = {
            days: days,
            active_day: days[0],
            active_index: 0,
            courseList: [],
            pagination: {
                current_page: "1",
                data: [],
                from: 0,
                last_page: 0,
                offset: 0,
                per_page: "5",
                to: 0,
                total: 0
            }
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
                active_day: clonedDays[index],
                active_index: index
            }, async () => {
                //update course data
                this.setState({loadingCourse: true});
                await this.updateCourseListByUserId(this.state.user_id, clonedDays[index].format_date);
            });
        }
    }

    chineseDay(day) {
        switch (day) {
            case 'MON':
                return '周一';
            case 'SAT':
                return '周六';
            case 'SUN':
                return '周日';
            case 'TUE':
                return '周二';
            case 'WED':
                return '周三';
            case 'THU':
                return '周四';
            case 'FRI':
                return '周五';
            default:
                break;
        }
    }

    async updateCourseListByUserId(user_id, date) {
        try {
            let courseList = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/optional?user_id=${user_id}&date=${date}&per_page=${this.state.pagination.per_page}&current_page=1`
                }
            });

            this.setState({courseList: courseList.data || [], loadingCourse: false, pagination: courseList}, () => {
                //animate
                this.refs.selectDay.animate();
            });
        }
        catch (ex) {
            ErrorHandler.notify('更新淘课列表出错', ex);
            this.setState({
                courseList: [], loadingCourse: false, pagination: {
                    current_page: "1",
                    data: [],
                    from: 0,
                    last_page: 0,
                    offset: 0,
                    per_page: "5",
                    to: 0,
                    total: 0
                }
            });
        }
    }

    async getLatestCourse(user_id, dates) {
        let courseList = [], index = 0, pagination = Object.assign({}, this.state.pagination);

        for (let i in dates) {
            let courseListData = await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/class-schedule/optional?user_id=${user_id}&date=${dates[i].format_date}&per_page=${this.state.pagination.per_page}&current_page=${this.state.pagination.current_page}`
                }
            });

            if (courseListData && courseListData.data && courseListData.data.length) {
                courseList = courseListData.data;
                index = i;
                dates[i].active = 1;
                pagination = courseListData;
                break;
            }
        }

        if (index === 0) {
            dates[0].active = 1;
        }

        this.setState({courseList: courseList, loadingCourse: false, active_day: dates[index], active_index: index, pagination: pagination}, () => {
            console.log(this.state.pagination);
        });
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

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        };
    }

    render() {
        return (
            <div className="flex-course">
                <SelectDay switchDay={this.switchDay}
                           ref='selectDay'
                           days={this.state.days}
                           active_day={this.state.active_day}
                           active_index={this.state.active_index}
                />
                <CourseList data={this.state.courseList}
                            loading={this.state.loadingCourse}
                            pagination={this.state.pagination}
                />
                <Footer/>
            </div>
        )
    }
}
