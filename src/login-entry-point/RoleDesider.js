import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";

export default class RoleDesider {
    static getRole() {
        if (window.location.pathname === '/tutor') {
            return MemberType.Companion;
        }
        if (window.location.pathname === '/student') {
            return MemberType.Student;
        }

        return URLHelper.getSearchParam(window.location.search, 'role')
    }
}