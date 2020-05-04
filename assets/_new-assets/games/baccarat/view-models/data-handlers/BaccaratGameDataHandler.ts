import DataHandler from "../../../../common/_base/view-models/DataHandler";
import { numberWithCommas } from "../../../../common/helpers/Helper";
import Baccarat from "../Baccarat";

export default class BaccaratGameDataHandler implements DataHandler {
    constructor(private readonly main: Baccarat) {
    }

    handle(data: any): boolean {
        if (!data.data) {
            return false;
        }

        var gameData = data.data;

        // TODO: Update total bet later

        return true;
    }

}