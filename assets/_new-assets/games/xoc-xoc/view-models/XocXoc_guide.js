cc.Class({
    extends: cc.Component,

    properties: {
        gameGuideWebView: cc.WebView
    },

    closeGuide: function () {
        this.node.destroy();
    },

    onLoad: function () {
        const urlParams = `?mo=${1.97}&4o=${14.4}&3o=${3.6}&minb=${1}&maxMainb=${1000}&max4b=${100}&max3b=${500}`;
        
        this.gameGuideWebView.url = `${window.location.href}/instructions/vi/xocxoc.html${urlParams}`;
    }
});
