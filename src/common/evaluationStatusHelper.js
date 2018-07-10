import Resources from '../resources';

export default class evaluationStatusHelper {

    static getStatusByStars(stars) {
        switch (stars){
            case 1:
                return Resources.getInstance().classEvaluationStarsStatus1;
            case 2:
                return Resources.getInstance().classEvaluationStarsStatus2;
            case 3:
                return Resources.getInstance().classEvaluationStarsStatus3;
            case 4:
                return Resources.getInstance().classEvaluationStarsStatus4;
            case 5:
                return Resources.getInstance().classEvaluationStarsStatus5;
            default:
                return Resources.getInstance().classEvaluationStarsStatus0;
        }
    }
}