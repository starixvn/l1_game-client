import ChanLeMain from "../ChanLeMain";

export default abstract class BaseDataHandler {
    readonly main: ChanLeMain;

    constructor(main: ChanLeMain) {
        this.main = main;
    }

}