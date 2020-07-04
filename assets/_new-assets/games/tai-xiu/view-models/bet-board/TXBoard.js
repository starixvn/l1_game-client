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
    this.MAX_BET = 1000;
    this.okButtonComponent = this.okButton.getComponent(cc.Button);
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
    let betValue = helper.getOnlyNumberInString(this.RedT.input.string) * 1 + value * 1;
    this.okButtonComponent.interactable = true;
    this.RedT.input.string = helper.numberWithCommas(betValue > this.MAX_BET ? this.MAX_BET : betValue);
  },
  onBackClick: function () {
    var number = helper.getOnlyNumberInString(this.RedT.input.string);
    this.RedT.input.string = helper.numberWithCommas(
      number.slice(0, number.length - 1)
    );
  },
  onCleanClick: function () {
    this.RedT.input.string = "";
    this.okButtonComponent.interactable = false;
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
