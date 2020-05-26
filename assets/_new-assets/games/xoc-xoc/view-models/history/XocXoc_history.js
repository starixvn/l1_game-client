let Helper = require("Helper");
import logger from "../../../../common/logger";
const sentryLogger = logger();

cc.Class({
  extends: cc.Component,

  properties: {
    page: cc.Prefab,
    content: cc.Node,
    iconRed: cc.SpriteFrame,
    iconWhite: cc.SpriteFrame,

    isMiniSedie: false,
  },
  onLoad() {
    let page = cc.instantiate(this.page);
    page.y = -263;
    this.node.addChild(page);
    this.page = page.getComponent("Pagination");
    Promise.all(
      this.content.children.map(function (obj) {
        return obj.getComponent("XocXoc_history_item");
      })
    )
      .then((tab) => {
        this.content = tab;
      })
      .catch((error) => {
        sentryLogger.logError(error);
      });

    this.page.init(this);
  },
  onEnable: function () {
    if (this.isMiniSedie) {
      cc.RedT.addDataObserver("MiniSedieDataObserver", this.receivedMiniSedieData.bind(this));
    } else {
      cc.RedT.addDataObserver("XocXocDataObserver", this.receivedXocXocData.bind(this));
    }
    this.get_data();
  },

  get_data: function (page = 1) {
    if (this.isMiniSedie) {
      cc.RedT.send({ g: { miniSedie: { getHistory: { red: true, page: page } } } });
    } else {
      cc.RedT.send({ g: { xocxoc: { log: { red: true, page: page } } } });
    }
  },
  receivedXocXocData: function (data) {
    if (data.xocxoc && data.xocxoc.history) {
      this.onData(data.xocxoc.history);
    }
  },
  receivedMiniSedieData: function (data) {
    if (data.miniSedie && data.miniSedie.history) {
      this.onData(data.miniSedie.history);
    }
  },
  onData: function (data) {
    let self = this;
    this.page.onSet(data.page, data.kmess, data.total);

    Promise.all(
      this.content.map(function (obj, i) {
        let dataT = data.data[i];
        if (void 0 !== dataT) {
          obj.node.active = true;

          obj.bg.active = i % 2;

          obj.time.string = Helper.getStringDateByTime(dataT.time);
          obj.phien.string = dataT.phien;

          let numb = 0;
          dataT.kq.forEach(function (dot) {
            if (dot) {
              numb++;
            }
          });

          if (!(numb % 2)) {
            obj.kqSprite.spriteFrame = self.iconWhite;
            obj.kqLabel.node.color = cc.Color.BLACK;
          } else {
            obj.kqSprite.spriteFrame = self.iconRed;
            obj.kqLabel.node.color = cc.Color.WHITE;
          }
          obj.kqLabel.string = numb;

          obj.chan.string = Helper.numberWithCommas(self.isMiniSedie ? dataT.even : dataT.chan);
          obj.le.string = Helper.numberWithCommas(self.isMiniSedie ? dataT.odd : dataT.le);
          obj.red3.string = Helper.numberWithCommas(dataT.red3);
          obj.red4.string = Helper.numberWithCommas(dataT.red4);
          obj.white3.string = Helper.numberWithCommas(dataT.white3);
          obj.white4.string = Helper.numberWithCommas(dataT.white4);
          obj.win.string = Helper.numberWithCommas(dataT.betwin);

          if (!(numb % 2)) {
            obj.chan.node.color = cc.Color.YELLOW;
            obj.le.node.color = cc.Color.WHITE;
          } else {
            obj.le.node.color = cc.Color.YELLOW;
            obj.chan.node.color = cc.Color.WHITE;
          }

          if (numb === 0) {
            obj.white4.node.color = cc.Color.YELLOW;
          } else {
            obj.white4.node.color = cc.Color.WHITE;
          }
          if (numb === 1) {
            obj.white3.node.color = cc.Color.YELLOW;
          } else {
            obj.white3.node.color = cc.Color.WHITE;
          }
          if (numb === 3) {
            obj.red3.node.color = cc.Color.YELLOW;
          } else {
            obj.red3.node.color = cc.Color.WHITE;
          }
          if (numb === 4) {
            obj.red4.node.color = cc.Color.YELLOW;
          } else {
            obj.red4.node.color = cc.Color.WHITE;
          }
        } else {
          obj.node.active = false;
        }
      })
    ).catch((error) => {
      sentryLogger.logError(error);
    });
  },

  closeDialog: function () {
    this.node.destroy();
  },
});
