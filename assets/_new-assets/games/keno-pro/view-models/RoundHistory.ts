const { ccclass, property } = cc._decorator;

@ccclass
export default class RoundHistory extends cc.Component {

    @property(cc.Node)
    options: cc.Node = null;

    @property(cc.Node)
    header: cc.Node = null;

    @property(cc.Node)
    logs: cc.Node = null;

    public onClick(event: cc.Component.EventHandler, game) {
        var index = 0;
        switch (event.target.name) {
            case "tai-xiu":
                index = 0;
            case "chan-le":
                index = 1;
            case "ngu-hanh":
                index = 2;
        }

        event.target.children[0].active = false;
        this.showHeader(index, true);
    }


    private showHeader(index: number, show: boolean) {
        this.header.children[index].active = show;
    }
}
