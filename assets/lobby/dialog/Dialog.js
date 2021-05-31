const { default: NoticeUtil } = require("../../common/utils/NoticeUtil");

cc.Class({
    extends: cc.Component,
    properties: {
        signNamePrefab: cc.Prefab
    },
    init: function (main) {
        this.main = main;
        this.node.active = false;
    },
    onClickBack: function () {
        cc.RedT.audio.playUnClick();
        this.onBack();
    },
    onBack: function () {
        this.onCloseDialog();
    },
    onCloseDialog: function () {
        if (this.currentDialog != null) {
            this.currentDialog.closeDialog();
        } else {
            this.node.active = false;
        }
    },
    /**
     * Function Show Dialog
     */
    showSignName: function () {
        if (!this.signName) {
            const node = cc.instantiate(this.signNamePrefab);
            this.node.addChild(node);
            this.signName = node.getComponent("SignName");
            this.signName.init(this.handleSignName.bind(this));
        }
        this.node.active = this.signName.node.active = true;
        this.currentDialog = this.signName.dialogNode.getComponent("CommonDialog");
        this.currentDialog.onDidHide = () => (this.node.active = false);
    },

    handleSignName: function (response) {
        if (response.authorized) {
            this.main.handleUserData(response.user);
        } else {
            const errorCode = response.errorCode;
            const text = NoticeUtil.getLocalizedErrorMessage(errorCode);
            this.main.showNotice({ text: `${text} (${errorCode})` });
        }

        this.main.Authorized(response.authorized);
    }
});
