import DropDownOption from "./DropDownOption";
import DropDownItem from "./DropDownItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DropDownList extends cc.Component {
    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Node)
    items: cc.Node = null;

    @property(cc.Node)
    optionContainer: cc.Node = null;

    private options: DropDownOption[] = [
        new DropDownOption("kenoProViet", "Keno Pro Việt"),
        new DropDownOption("kenoMax", "Keno Max"),
        new DropDownOption("kenoMax2", "Keno Max 2"),
        new DropDownOption("kenoMini", "Keno Mini"),
        new DropDownOption("kenoMini2", "Keno Mini 2"),
        new DropDownOption("kenoEast", "Keno Đông"),
        new DropDownOption("kenoWest", "Keno Tây"),
        new DropDownOption("kenoSouth", "Keno Nam"),
        new DropDownOption("kenoNorth", "Keno Bắc"),
    ];

    public selectedItem: DropDownOption = null;

    onLoad() {
        this.options.forEach(option => this.addItem(option));
    }

    addItem(option: DropDownOption) {
        let itemNode = cc.instantiate(this.prefabItem);
        let itemComponent: DropDownItem = itemNode.getComponent("DropDownItem");
        itemComponent.label.string = option.text;
        itemComponent.value = option.value;
        itemNode.on("click", this.onSelectItem, this);
        this.items.addChild(itemNode);
    }

    onSelectItem(button: cc.Button) {
        const component: DropDownItem = button.node.getComponent("DropDownItem");
        if (component) {
            this.selectedItem = new DropDownOption(component.value, component.label.string);
        }

        this.close();
    }

    open() {
        this.optionContainer.active = true;
    }

    close() {
        this.optionContainer.active = false;
    }
}
