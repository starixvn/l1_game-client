module.exports = {
  showNoticeMessage: function(instance, message) {
    var notice = cc.instantiate(instance.mini_warning);
    var noticeComponent = notice.getComponent("mini_warning");
    noticeComponent.text.string = message;
    instance.notice.addChild(notice);
  }
};
