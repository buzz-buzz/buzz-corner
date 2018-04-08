const timeHelper = require('./timeHelper');
import Resources from "../resources";

beforeEach(() => {
    Resources.setCulture('zh-CN');
})

describe('get date diff', () => {
    it('should display "今天開始" when start_time is in 15 min', () => {
        expect(timeHelper.timeDiff(new Date(2018, 3, 8, 12, 0), new Date(2018, 3, 8, 12, 25), new Date(2018, 3, 8, 10, 14))).toEqual('今天开始')
    });

    it('should display "已结束" ', () => {
        expect(timeHelper.timeDiff(new Date(2018, 3, 8, 12, 0), new Date(2018, 3, 8, 12, 25), new Date(2018, 3, 8, 18, 14))).toEqual('已结束')
    });

    it('should display "1天后开始" ', () => {
        expect(timeHelper.timeDiff(new Date(2018, 3, 8, 12, 0), new Date(2018, 3, 8, 12, 25), new Date(2018, 3, 7, 18, 14))).toEqual('1 天后开始')
    });

    it('should display "7天后开始" ', () => {
        expect(timeHelper.timeDiff(new Date(2018, 3, 8, 12, 0), new Date(2018, 3, 8, 12, 25), new Date(2018, 3, 1, 18, 14))).toEqual('7 天后开始')
    });

    it('should display "已开始" ', () => {
        expect(timeHelper.timeDiff(new Date(2018, 3, 8, 12, 0), new Date(2018, 3, 8, 12, 25), new Date(2018, 3, 8, 12, 14))).toEqual('已开始')
    });
});