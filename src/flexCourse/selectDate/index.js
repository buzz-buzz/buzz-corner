import React from 'react';
import './index.css';

export default class SelectDay extends React.Component{
    render(){
        return (
            <div className="select-day">
                <div className="month-year">{this.props.activeDay.month_year}</div>
                <div className="days">
                    {
                        this.props.days.map((item, index)=><div className={item.active ? "day-item day-item-active" : "day-item"}
                             onClick={()=>this.props.switchDay(index)} key={index}>
                            <div className="day-num">{item.date}</div>
                            <div className="day-en">{item.day}</div>
                            {
                                !!item.active && <div className="day-active">
                                    <div></div>
                                </div>
                            }
                        </div>)
                    }
                </div>
            </div>
        )
    }
}