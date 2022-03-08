const { ccclass, property } = cc._decorator;

@ccclass
export default class CategoryChild extends cc.Component {
    @property(cc.Node)
    newNode: cc.Node = null;
}
