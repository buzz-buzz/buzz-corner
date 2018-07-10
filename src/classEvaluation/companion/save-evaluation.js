import ServiceProxy from "../../service-proxy";

export default class SendEvaluation {
    static async saveClassPerformance(classId, fromUserId, toUserId, score, comment) {
        return await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/class-feedback/${classId}/${fromUserId}/evaluation/${toUserId}`,
                method: 'POST',
                json: {
                    comment: comment,
                    score: score,
                    type: 'ClassPerformance'
                }
            }
        })
    }
}