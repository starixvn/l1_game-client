import AudioManager from "../audio/AudioManager";

const { ccclass, property } = cc._decorator;
export enum InGameMenuEvents {
    OPEN_HISTORY = "open_history",
    OPEN_GUIDE = "open_guide",
    OPEN_TICKET_DETAIL = "open_ticket_detail",

    CLOSE_GAME = "close_game",

    GO_TO_LOBBY = "go_to_lobby",
    CHANGE_ORIENTATION = "change_orientation"
}

@ccclass
export default class InGameMenu extends cc.Component {
    protected doCommons() {
        AudioManager.getInstance().playClick();
    }

    collapseMenu(animated: boolean) {}

    onClickOpenHistory() {
        this.doCommons();
        this.node.emit(InGameMenuEvents.OPEN_HISTORY);
    }

    onClickOpenGuide() {
        this.doCommons();
        this.node.emit(InGameMenuEvents.OPEN_GUIDE);
    }

    onClickOpenTicketDetails() {
        this.doCommons();
        this.node.emit(InGameMenuEvents.OPEN_TICKET_DETAIL);
    }

    onClickCloseGame() {
        this.doCommons();
        this.node.emit(InGameMenuEvents.CLOSE_GAME);
    }

    onClickGoToLobby() {
        this.doCommons();
        this.node.emit(InGameMenuEvents.GO_TO_LOBBY);
    }

    onClickChangeOrientation() {
        this.doCommons();
        this.node.emit(InGameMenuEvents.CHANGE_ORIENTATION);
    }
}
