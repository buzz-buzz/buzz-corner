module.exports = {
    getWeekdayNameByIndex(dayOfWeek) {
        return [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ][dayOfWeek];
    },

    getMonthNameByIndex(monthIndex) {
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][monthIndex];
    },

    formatSecondsToHHMMSS(seconds) {
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        seconds = Math.floor(seconds - hours * 60 * 60 - minutes * 60);

        if (hours < 10) {
            hours = '0' + hours
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return `${hours}:${minutes}:${seconds}`;
    },

    dateDiff (start_time, now_time) {
        let theDate = new Date(start_time.getFullYear() + '-' + (start_time.getMonth() + 1 ) + '-' + start_time.getDate());

        let nowDate = new Date(now_time.getFullYear() + '-' + (now_time.getMonth() + 1) + '-' + now_time.getDate());

        return Math.round((theDate - nowDate) / (1000 * 3600 * 24));
    },

    timeDiff(start_time, end_time, now_time, language)
    {
        let d = this.dateDiff(start_time, now_time);

        if (d > 1) {
            return language === 'zh-CN' ? `${d} 天后开始` : `After ${d} days`;
        }

        if (d === 1) {
            return language === 'zh-CN' ? `${d} 天后开始` : 'Start tomorrow';
        }

        if (d <= 0 && language !== 'zh-CN') {
            return (start_time - now_time > 0 ? 'Start today' : ( end_time - now_time > 0 ? 'Started' : 'Ended' ))
        }

        if(d <= 0 && language === 'zh-CN'){
            return (start_time - now_time > 0 ? '今天开始' : ( end_time - now_time > 0 ? '已开始' : '已结束' ))
        }
    }
    ,

    timeDiffStyle(start_time, end_time, now_time)
    {
        let leftDays = this.dateDiff(start_time, now_time);

        return leftDays >= 1 ? 'rgb(0, 216, 90)' : (start_time - now_time > 0 ? 'rgb(0, 216, 90)' : ( end_time - now_time > 0 ? 'rgb(246, 180, 12)' : 'rgb(102， 102， 102)' ));
    }
}
;