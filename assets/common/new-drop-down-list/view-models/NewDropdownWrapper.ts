// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import NewDropDownList from "./NewDropDownList";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewDropdownListWrapper extends cc.Component {
    @property(cc.Node)
    layerCloseList: cc.Node = null;

    @property(cc.Node)
    dropdown: cc.Node = null;

    dropList: NewDropDownList;

    start() {
        this.dropList = this.dropdown.getChildByName("DropDownList").getComponent(NewDropDownList);
        this.dropList.checkLayerCloseDrop = (isCheck) => {
            this.layerCloseList.active = isCheck;
        };
    }
}
