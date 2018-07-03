import moment from "moment/moment";

/**
 * @return {string}
 */
export default function ClassEndTime(props) {
    let {class_id, class_start_time, class_end_time} = props.classInfo

    if (!class_start_time) {
        class_start_time = props.classInfo.start_time
    }

    if (!class_end_time) {
        class_end_time = props.classInfo.end_time
    }

    if (isFinite(class_id)) {
        return moment(class_start_time).add(25, 'minutes').format('HH:mm')
    } else {
        return moment(class_end_time).format('HH:mm')
    }
}