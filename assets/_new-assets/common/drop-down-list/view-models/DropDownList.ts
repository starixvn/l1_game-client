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

    @property(cc.Label)
    captionLabel: cc.Label = null;

    private options: DropDownOption[] = [];

    public selectedItem: DropDownOption = null;

    public onSelectedItemChanged: () => void;

    init(options: DropDownOption[], onSelectedItemChanged: () => void) {
        this.options = options;
        this.selectedItem = this.options[0];
        this.captionLabel.string = this.selectedItem.text;
        this.onSelectedItemChanged = onSelectedItemChanged;
    }

    onLoad() {
        this.optionContainer.active = false;
    }

    onCaptionClick() {
        if (!this.optionContainer.active) {
            this.openDropDown();
        } else {
            this.closeDropDown();
        }
    }

    addItem(option: DropDownOption) {
        let itemNode = cc.instantiate(this.prefabItem);
        let itemComponent: DropDownItem = itemNode.getComponent("DropDownItem");
        itemComponent.label.string = option.text;
        itemComponent.value = option.value;
        itemNode.on(cc.Node.EventType.TOUCH_END, this.onSelectItem, this);
        this.items.addChild(itemNode);
    }

    onSelectItem(event: cc.Event.EventTouch) {
        const component: DropDownItem = event.currentTarget.getComponent("DropDownItem");
        if (component) {
            this.selectedItem = new DropDownOption(component.value, component.label.string);
            this.captionLabel.string = this.selectedItem.text;
            this.onSelectedItemChanged();
        }

        this.closeDropDown();
    }

    openDropDown() {
        this.options.forEach(option => {
            option.value != this.selectedItem.value && this.addItem(option);
        });
        this.optionContainer.active = true;
    }

    closeDropDown() {
        this.optionContainer.active = false;
        this.items.destroyAllChildren();
    }
}
