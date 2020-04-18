import DataHandler from "../../../../../common/_base/view-models/DataHandler";
import ChanLeMain from "../ChanLeMain";
import BaseDataHandler from "./BaseDataHandler";

export default class ErrorDataHandler extends BaseDataHandler implements DataHandler {
    constructor(main: ChanLeMain) {
        super(main);
    }

    handle(data: any): boolean {
        if (data.apiError) {
            this.main.closeProcessWarning();
            return true;
        }

        if (data.err) {
            this.main.closeProcessWarning();
            this.main.showMiniWarning(data.err);
            return true;
        }

        return false;
    }

}