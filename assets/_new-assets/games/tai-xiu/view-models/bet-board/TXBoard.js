var helper = require("Helper");

cc.Class({
  extends: cc.Component,

  properties: {
    nodeChonTien: {
      default: null,
      type: cc.Node
    },
    okButton: {
      default: null,
      type: cc.Node
    }
  },
  init(obj) {
    this.RedT = obj;
  },
  onEnable() {
    const okButtonPositionY = this.okButton.parent.convertToWorldSpaceAR(this.okButton.position).y;
    const expectPositionY = this.okButton.height;
    const paddingBottom = 20;

    if (okButtonPositionY < expectPositionY) {
      const distance = expectPositionY - okButtonPositionY + paddingBottom;

      this.RedT.node.runAction(
        cc.moveBy(0.5, cc.v2(0, distance)).easing(cc.easeBackOut()));
    }
  },
  ChonTienClick: function (event, value) {
    this.RedT.input.string = helper.numberWithCommas(
      helper.getOnlyNumberInString(this.RedT.input.string) * 1 + value * 1
    );
  },
  onBackClick: function () {
    var number = helper.getOnlyNumberInString(this.RedT.input.string);
    this.RedT.input.string = helper.numberWithCommas(
      number.slice(0, number.length - 1)
    );
  },
  onCleanClick: function () {
    this.RedT.input.string = "";
  },
  onAllClick: function () {
    this.RedT.input.string = helper.numberWithCommas(
      this.RedT.red ? cc.RedT.user.red : cc.RedT.user.xu
    );
    this.RedT.setBetButtonClicked(false);
  },
  onCloseClick: function () {
    this.node.active = false;
    this.RedT.resetBetButtonText();
    this.RedT.setBetButtonClicked(false);
  },
  onOkClick: function () {
    this.node.active = false;
    this.RedT.resetBetButtonText();
    this.RedT.setBetButtonClicked(false);
  }
});
