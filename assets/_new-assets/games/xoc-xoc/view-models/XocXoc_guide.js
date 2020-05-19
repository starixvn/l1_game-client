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
        var odd = this.configs.odd;
        var choices_maxbet = this.configs.choices_maxbet;

        const urlParams = `?mo=${odd.even}&4o=${odd.red4}&3o=${odd.red3}&minb=${this.configs.minbet}&maxMainb=${choices_maxbet.even}&max4b=${choices_maxbet.red4}&max3b=${choices_maxbet[choices_maxbet.red3]}`;

        this.gameGuideWebView.url = `${window.location.href}/instructions/vi/xocxoc.html${urlParams}`;
    }
});
