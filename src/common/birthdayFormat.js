export default class birthdayFormat {
    static getBirthdayFromDbFormat(date_of_birth) {
        if (date_of_birth) {
            let date = new Date(date_of_birth);
            return String(date.getFullYear()) + '-' + String(date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-' + String(date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
        } else {
            return ''
        }
    }
}