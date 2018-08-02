import React from 'react';
import './index.css';

export default class SelectDay extends React.Component{
    constructor(){
        super();

        this.state = {
            days: [
                {
                    date: 25,
                    day: 'SUN',
                    active: 1
                },
                {
                    date: 26,
                    day: 'MON'
                },
                {
                    date: 27,
                    day: 'TUE'
                },
                {
                    date: 28,
                    day: 'WED'
                },
                {
                    date: 29,
                    day: 'THU'
                },
                {
                    date: 30,
                    day: 'FRI'
                },
                {
                    date: 31,
                    day: 'SAT'
                }
            ]
        }
    }

    switchDay(index){
        if(!this.state.days[index].active){
            let clonedDays = this.state.days.slice();
            for(let i in clonedDays){
                if(clonedDays[i].active){
                    clonedDays[i].active = 0;
                }
            }
            clonedDays[index].active = 1;
            this.setState({
                days: clonedDays
            });
        }
    }

    render(){
        return (
            <div className="select-day">
                <div className="month-year">July 2018</div>
                <div className="days">
                    {
                        this.state.days.map((item, index)=><div className={item.active ? "day-item day-item-active" : "day-item"}
                             onClick={()=>this.switchDay(index)} key={index}>
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