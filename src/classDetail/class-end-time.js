import moment from "moment/moment";

/**
 * @return {string}
 */
export default function ClassEndTime(props) {
    let {class_end_time} = props.classInfo

    if (!class_end_time) {
        class_end_time = props.classInfo.end_time
    }

    return moment(class_end_time).format('HH:mm');
}