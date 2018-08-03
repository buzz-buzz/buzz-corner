import React from 'react';
import SelectDay from './selectDate';
import CourseList from './courseList';
import Footer from '../layout/footer';
import {MemberType} from "../membership/member-type";
import './index.css';

export default class FlexCourse extends React.Component{
    render(){
        return (
            <div className="flex-course">
                <SelectDay/>
                <CourseList/>
                <Footer role={MemberType.Student}/>
            </div>
        )
    }
}