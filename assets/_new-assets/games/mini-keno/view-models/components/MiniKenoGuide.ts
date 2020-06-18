const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoGuide extends cc.Component {

    @property(cc.Node)
    sideBar: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    title: cc.Label = null;

    private gameName = "kenoProViet";

    onLoad() {
        this.select(this.gameName);
    }

    selectGame(event, game) {
        this.gameName = game;
        this.select(game);
    }

    select(game: string) {
        cc.RedT.audio.playClick();
        var self = this;
        Promise.all(this.sideBar.children.map(function (obj) {
            if (obj.name == game) {
                obj.children[0].active = true;
                obj.pauseSystemEvents(true);
                self.title.string = obj.children[1].getComponent(cc.Label).string;
            } else {
                obj.children[0].active = false;
                obj.resumeSystemEvents(true);
            }
            return void 0;
        }));

        Promise.all(this.content.children.map(function (obj) {
            if (obj.name == game) {
                obj.active = true;
            } else {
                obj.active = false;
            }
            return void 0;
        }));
    }

    closeDialog() {
        this.node.active = false;
    }
}
