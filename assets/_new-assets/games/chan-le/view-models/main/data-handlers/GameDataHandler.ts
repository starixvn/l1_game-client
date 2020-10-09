import DataHandler from "../../../../_base/handlers/DataHandler";
import BaseDataHandler from "./BaseDataHandler";
import ChanLeMain from "../ChanLeMain";
import { numberWithCommas } from '../../../../../common/helpers/Helper';

export default class GameDataHandler extends BaseDataHandler implements DataHandler {
    constructor(main: ChanLeMain) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data[this.main.root.gameName] || this.main.isDisabled) {
            return false;
        }

        var chanleData = data[this.main.root.gameName];

        if (chanleData.red_me_chan || chanleData.red_me_le) {
            this.main.closeProcessWarning();
        }

        this.main.redChan = chanleData.red_chan;
        this.main.redLe = chanleData.red_le;

        chanleData.red_chan && (this.main.totalBetLeft.string = numberWithCommas(chanleData.red_chan));
        chanleData.red_le && (this.main.totalBetRight.string = numberWithCommas(chanleData.red_le));
        chanleData.red_me_chan && (this.main.userBetLeft.string = numberWithCommas(chanleData.red_me_chan));
        chanleData.red_me_le && (this.main.userBetRight.string = numberWithCommas(chanleData.red_me_le));
        if (chanleData.red_player_chan) {
            const userBetChanPercent = parseInt(chanleData.red_player_chan) >> 0;
            this.main.playersLeft.string = userBetChanPercent + "%";
        }
        if (chanleData.red_player_le) {
            const userBetLePercent = parseInt(chanleData.red_player_le) >> 0;
            this.main.playersRight.string = userBetLePercent + "%";
        }

        return true;
    }
}