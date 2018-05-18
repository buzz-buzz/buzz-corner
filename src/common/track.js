const TDAPP = window.TDAPP

export default {
    // track.event('首页', '消息点击', { '消息状态': '已读', '消息类型': '好友' })
    event(EventId, Label, MapKv) {
        const width = window.screen.width
        const height = window.screen.height
        const client = Math.min(width, height) >= 600 ? 'tablet' : 'phone'
        TDAPP && TDAPP.onEvent(EventId, Label, Object.assign({
            url: window.location.href,
            ua: window.navigator.userAgent,
            width,
            height,
            client,
        }, MapKv))
    }
}
