const TDAPP = window.TDAPP

export default {
  // track.event('首页', '消息点击', { '消息状态': '已读', '消息类型': '好友' })
  event(EventId，Label，MapKv){
    TDAPP && TDAPP.onEvent (EventId，Label，MapKv)
  }
}
