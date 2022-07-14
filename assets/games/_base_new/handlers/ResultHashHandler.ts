import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import NewGameData from "../models/NewGameData";

export type ResultHashType = {
    resultHash: any;
};

export class ResultHashHandler extends BaseEventHandler<ResultHashType> {
    protected readonly gameData: NewGameData;
    protected verifyEvent(event: ResultHashType) {
        return event.resultHash != null;
    }

    protected handle(event: ResultHashType) {
        const data = event.resultHash;

        if (!!data.rawValue) {
            this.gameData.resultHash.changeLater(data);
        } else {
            this.gameData.resultHash.change(data);
        }
    }
}
