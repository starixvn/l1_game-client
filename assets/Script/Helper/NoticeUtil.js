module.exports = {
  showNoticeMessage: function(instance, message) {
    var notice = cc.instantiate(instance.mini_warning);
    var noticeComponent = notice.getComponent("mini_warning");
    noticeComponent.text.string = message + " " + (self.red ? "Red" : "Xu");
    instance.notice.addChild(notice);
  }
};
