var TXTop = require("TXTop");

cc.Class({
  extends: TXTop,
  get_data: function () {
    cc.RedT.send({
      taixiu_turbo: { get_top: { red: this.red, taixiu: this.taixiu } }
    });
  },
});
