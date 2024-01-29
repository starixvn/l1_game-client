import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseProvablyFairHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any) {
        if (data.resultHash) {
            this.main.provablyFairComponent?.updateProvablyFairString(data.resultHash);
        }

        if (data.provablyFair) {
            this.main.handleProvablyFairVerifyData(data.provablyFair);
        }
    }
}
