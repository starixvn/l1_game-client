var BrowserUtil = require("BrowserUtil");
const { default: UserService } = require("../../../common/auth/UserService");
const NameGenerator = require("../../../common/name-generator/NameGenerator");
const InvalidUserName = "Tên nhân vật không hợp lệ.";

cc.Class({
    extends: cc.Component,

    properties: {
        username: {
            default: null,
            type: cc.EditBox
        },
        errorMessage: {
            default: null,
            type: cc.Label
        },
        dialogNode: cc.Node
    },
    init(onSuccessFunc) {
        this.onSuccessFunc = onSuccessFunc;
    },
    onLoad() {
        var self = this;
        this.keyHandle = function (t) {
            if (t.keyCode === cc.macro.KEY.tab) {
                self.changeNextFocusEditBox();
                if (t.preventDefault && t.preventDefault()) {
                    return false;
                }
                return undefined;
            } else if (t.keyCode === cc.macro.KEY.enter) {
                BrowserUtil.focusGame();
                self.onSignNameClick();
                if (t.preventDefault && t.preventDefault()) {
                    return false;
                }
                return undefined;
            }

            return undefined;
        };
    },
    onEnable: function () {
        cc.sys.isBrowser && this.addEvent();
        this.generateName();
    },
    onDisable: function () {
        cc.sys.isBrowser && this.removeEvent();
        this.clean();
    },
    onEditClick: function () {
        cc.RedT.audio.playClick();
        this.username.focus();
    },
    onGenerateNameClick: function () {
        cc.RedT.audio.playClick();
        this.generateName();
    },
    generateName: function () {
        this.username.string = NameGenerator.default.generateName();
        this.usernameTextChanged();
    },
    addEvent: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        BrowserUtil.getHTMLElementByEditBox(this.username).addEventListener("keydown", this.keyHandle, !1);
        this.username.node.on("text-changed", this.usernameTextChanged, this);
    },
    removeEvent: function () {
        BrowserUtil.getHTMLElementByEditBox(this.username).removeEventListener("keydown", this.keyHandle, !1);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.username.node.off("text-changed", this.usernameTextChanged, this);
    },
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.tab:
                this.isTop() && this.changeNextFocusEditBox();
                break;
            case cc.macro.KEY.enter:
                this.isTop() && this.onSignNameClick();
        }
    },
    changeNextFocusEditBox: function () {
        BrowserUtil.focusEditBox(this.username);
    },
    isTop: function () {
        return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
    },
    clean: function () {
        this.username.string = "";
    },
    onSignNameClick: function () {
        if (this.validateUsername(this.username.string)) {
            this.errorMessage.string = InvalidUserName;
        } else {
            //Ricky: Client SignName
            //cc.RedT.send({ signName: this.username.string });
            const authData = window.authData;
            UserService.getInstance().signName(authData.ss, authData.username, this.username.string).then(this.onSuccessFunc);
        }
    },

    usernameTextChanged: function () {
        if (this.validateUsername(this.username.string)) {
            this.errorMessage.string = InvalidUserName;
        } else {
            this.errorMessage.string = "";
        }
    },

    validateUsername: function (username) {
        const regex = new RegExp("^[a-zA-Z0-9]+$");
        return username.length > 14 || username.length < 3 || username.match(regex) === null;
    }
});
