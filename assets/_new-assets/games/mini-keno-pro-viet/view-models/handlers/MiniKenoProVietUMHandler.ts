import MiniKenoProViet from "../MiniKenoProViet";
import GameBaseUmDataHandler from "../../../_base/handlers/GameBaseUmHandler";

export default class MiniKenoProVietUMHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    handle(data: any): boolean {
        if (data.um) {
            this.main.showUmMessage(data);
            return true;
        }

        if (data.um == false) {
            this.main.hideUmMessage();
            return false;
        }

    }
}
