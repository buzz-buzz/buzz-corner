import React from 'react';
import './index.css';

export default class SelectDay extends React.Component {
    constructor(props){
        super(props);

        this.animate = this.animate.bind(this);
    }

    animate(){
        console.log('total=', document.getElementById('active').style.left);
    }

    render() {
        return (
            <div className="select-day">
                <div className="month-year">{this.props.active_day.month_year}</div>
                <div className="days" id="days">
                    {
                        this.props.days && this.props.days.length &&
                        this.props.days.map((item, index) => <div
                            className={item.active ? "day-item day-item-active" : "day-item"}
                            onClick={() => this.props.switchDay(index)} key={index}>
                            <div className="day-num">{item.date}</div>
                            <div className="day-en">{item.day}</div>
                        </div>)
                    }
                    <div id="active" className="active-status"
                         style={{left: 'calc(20px + calc((100% - 40px) / 7) * ' + this.props.active_index + ')'}}
                    >
                        <div></div>
                    </div>
                </div>
            </div>
        )
    }
}