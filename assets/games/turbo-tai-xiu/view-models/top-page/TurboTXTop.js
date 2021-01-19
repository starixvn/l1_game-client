var TXTop = require("TXTop");

cc.Class({
  extends: TXTop,
  get_data: function () {
    cc.RedT.send({
      taixiu_turbo: { get_top: { red: this.red, taixiu: this.taixiu } }
    });
  },

  init(obj) {
    this.RedT = obj;
    if (void 0 !== cc.RedT.setting.taixiu_turbo.top_position) {
      this.node.position = cc.RedT.setting.taixiu_turbo.top_position;
    }
    if (void 0 !== cc.RedT.setting.taixiu_turbo.top_active) {
      this.node.active = cc.RedT.setting.taixiu_turbo.top_active;
    }
  },

  eventEnd: function () {
    cc.RedT.setting.taixiu_turbo.top_position = this.node.position;
  },
});
