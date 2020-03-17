var Helper = require("Helper"),
  Pagination = require("Pagination");

cc.Class({
  extends: cc.Component,
  properties: {
    content: cc.Node,
    page: Pagination,
    ItemPrefab: cc.Prefab
  },
  init(obj) {
    this.RedT = obj;
  },
  onLoad() {
    this.page.init(this);
  },
  onEnable: function () {
    this.get_data();
  },
  onDisable: function () { },
  get_data: function (page = 1) {
    cc.RedT.send({ taixiu: { get_log: { page: page } } });
  },
  hide: function () {
    this.node.active = false;
  },
  onData: function (data) {
    this.page.onSet(data.page, data.kmess, data.total);
    this.content.removeAllChildren(true);

    for (var i = 0; i < 9; i++) {
      var dataT = data.data[i];
      var itemPrefab = cc.instantiate(this.ItemPrefab);
      var item = itemPrefab.getComponent("TXHistoryItem");
      if (void 0 !== dataT) {
        item.node.active = true;
        var tong = dataT.dice1 + dataT.dice2 + dataT.dice3;
        item.time.string = Helper.getStringDateByTime(dataT.time);
        item.phien.string = dataT.phien;
        item.dat.string = dataT.taixiu
          ? dataT.select
            ? "Tài"
            : "Xỉu"
          : dataT.select
            ? "Chẵn"
            : "Lẻ";
        item.ketqua.string =
          dataT.dice1 + "-" + dataT.dice2 + "-" + dataT.dice3 + "  " + tong;
        item.cuoc.string = Helper.numberWithCommas(dataT.bet);
        item.tralai.string = Helper.numberWithCommas(dataT.tralai);
        item.donvi.string = dataT.red ? "SCOIN" : "XU";
        item.donvi.node.color = dataT.red
          ? cc.Color.YELLOW
          : item.donvi.node.color.fromHEX("#E2E2E2");

        item.time.node.color = dataT.win
          ? cc.Color.YELLOW
          : item.time.node.color.fromHEX("#E2E2E2");
        item.dat.node.color = dataT.win
          ? cc.Color.YELLOW
          : item.dat.node.color.fromHEX("#E2E2E2");
      } else {
        item.node.active = false;
      }
      this.content.addChild(itemPrefab);
    }

    // Promise.all(
    //   this.content.map(function (obj, index) {
    //     var dataT = data.data[index];
    //     if (void 0 !== dataT) {
    //       obj.node.active = true;
    //       var tong = dataT.dice1 + dataT.dice2 + dataT.dice3;
    //       obj.time.string = Helper.getStringDateByTime(dataT.time);
    //       obj.phien.string = dataT.phien;
    //       obj.dat.string = dataT.taixiu
    //         ? dataT.select
    //           ? "Tài"
    //           : "Xỉu"
    //         : dataT.select
    //           ? "Chẵn"
    //           : "Lẻ";
    //       obj.ketqua.string =
    //         dataT.dice1 + "-" + dataT.dice2 + "-" + dataT.dice3 + "  " + tong;
    //       obj.cuoc.string = Helper.numberWithCommas(dataT.bet);
    //       obj.tralai.string = Helper.numberWithCommas(dataT.tralai);
    //       obj.donvi.string = dataT.red ? "SCOIN" : "XU";
    //       obj.donvi.node.color = dataT.red
    //         ? cc.Color.YELLOW
    //         : obj.donvi.node.color.fromHEX("#E2E2E2");

    //       obj.time.node.color = dataT.win
    //         ? cc.Color.YELLOW
    //         : obj.time.node.color.fromHEX("#E2E2E2");
    //       obj.dat.node.color = dataT.win
    //         ? cc.Color.YELLOW
    //         : obj.dat.node.color.fromHEX("#E2E2E2");
    //     } else {
    //       obj.node.active = false;
    //     }
    //   })
    //);
  }
});
