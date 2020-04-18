var TXHistory = require("TXHistory");

cc.Class({
  extends: TXHistory,

  get_data: function (page = 1) {
    cc.RedT.send({ taixiu_turbo: { get_log: { page: page } } });
  },
});
