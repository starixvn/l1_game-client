const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratCard extends cc.Component {

    @property(cc.Node)
    highlight: cc.Node = null;

    setHighlight() {
        this.highlight.active = true;
    }

    resetHighlight() {
        this.highlight.active = false;
    }

}
