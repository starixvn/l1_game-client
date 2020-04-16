const { ccclass, property } = cc._decorator;
import ChanLe from './../ChanLe';

@ccclass
export default class ChanLeTopUsers extends cc.Component {

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    item: cc.Prefab = null;

    @property(cc.Label)
    title: cc.Label = null;

    private root: ChanLe;

    init(root: ChanLe) {
        this.root = root;
    }

    onEnable() {
        this.getTopUsersData();
    }

    onDisable() {
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    onData(data) {

    }

    close() {
        cc.RedT.audio.playClick();
        this.node.active = false;
    }

    getTopUsersData() {
        this.root.sendData({
            get_top: true
        });
    }

}
