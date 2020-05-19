cc.Class({
    extends: cc.Component,

    properties: {
        gameGuideWebView: cc.WebView
    },

    closeGuide: function () {
        this.node.destroy();
    },

    init: function (configs) {
        this.configs = configs;
    },

    onLoad: function () {
        var odds = this.configs.odds;
        var choices_maxbet = this.configs.choices_maxbet;

        const urlParams = `?mo=${odds.even}&4o=${odds.red4}&3o=${odds.red3}&minb=${this.configs.minbet}&maxMainb=${choices_maxbet.even}&max4b=${choices_maxbet.red4}&max3b=${choices_maxbet[choices_maxbet.red3]}`;

        this.gameGuideWebView.url = `${window.location.href}/instructions/vi/xocxoc.html${urlParams}`;
    }
});
