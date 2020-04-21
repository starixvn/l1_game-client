const { ccclass, property } = cc._decorator;
import ChanLe from './../ChanLe';
import ChanLeTopUsersItem from './ChanLeTopUsersItem';
import { numberWithCommas } from './../../../../common/helpers/Helper';

@ccclass
export default class ChanLeTopUsers extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Prefab)
    item: cc.Prefab = null;

    private static readonly TOP_CHAN_LE = "Top"
    private root: ChanLe;

    init(root: ChanLe) {
        this.root = root;
        this.title.string = `${ChanLeTopUsers.TOP_CHAN_LE} ${this.root.gameTitle}`.toUpperCase();
    }

    onEnable() {
        this.getTopUsersData();
    }

    onDisable() {
        this.root.hideTop();
        this.node.destroy();
    }

    onData(data) {
        this.scrollView.content.destroyAllChildren();
        var self = this;

        Promise.all(
            data.map(function (user, index) {
                var userItem = cc.instantiate(self.item);
                var itemComponent = userItem.getComponent("ChanLeTopUsersItem") as ChanLeTopUsersItem;
                itemComponent.rank.string = index + 1;
                itemComponent.userName.string = user.name;
                itemComponent.winMoney.string = numberWithCommas(user.bet);
                itemComponent.node.children[0].active = index % 2 ? true : false;
                self.scrollView.content.addChild(userItem);
            })
        );
    }

    getTopUsersData() {
        this.root.sendData({
            get_top: true
        });
    }

}
