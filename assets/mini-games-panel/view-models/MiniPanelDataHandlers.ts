import GameUtils from '../../common/GameUtils';
import { NoticeData } from '../../common/notice/view-models/Notice';
import * as SabaConfigs from '../../configs/SabaConfigs';
import * as authManager from './../../common/auth/AuthManager';
import MiniPanel from './MiniPanel';

declare global {
    interface Window {
        umInfo: any;
    }
}

export default class MiniPanelDataHandlers {
    constructor(private readonly main: MiniPanel) {}

    handleData(data) {
        if (data.mini) {
            this.handleData(data.mini);
        }

        if (data.kickedOut) {
            this.handleDataKickedOut(data.kickedOut);
        }

        if (data.apiError) {
            this.handleDataApiError(data);
        }

        if (data.reload) {
            this.main.onForceReload();
        }

        if (data.toGame) {
            this.main.loadGameRoom(data.toGame);
        }

        if (data.notice) {
            this.handleNoticeData(data.notice);
        }

        if (data.unauthorized) {
            this.main.forceKickedOut();
        }

        if (data.Authorized) {
            cc.RedT.IS_LOGIN = true;
            this.main.onSignIn();
        }

        if (data.notPermittedToPlay) {
            authManager.removeInRoomGameId();

            const gameId = data.gameId;
            const gameName = GameUtils.getGameNameString(gameId);
            const message = `${gameName}\nTài khoản của bạn hiện đang bị giới hạn, vui lòng thử các trò chơi khác.`;
            this.main.onForceReload(true, message);
        }

        if (data.userStakeLevel) {
            cc.RedT.userStakeLevelData(data.userStakeLevel);
        }
    }

    handleDataKickedOut(data: any) {
        authManager.removeSession();

        if (data.umInfo) {
            cc.RedT.forceKickedOut();
            window.umInfo = data.umInfo;
            cc.director.loadScene("um");
        } else {
            if (data.isDisabledAccount) {
                setTimeout(() => {
                    if (authManager) {
                        this.main.forceKickedOut();
                    }
                }, 10000);
            } else {
                this.main.forceKickedOut();
            }
            const noticeData = { text: data.message } as NoticeData;
            this.main.showNotice(noticeData, this.main.forceKickedOut, this.main.forceKickedOut);
        }
    }

    handleDataApiError(apiErrorData: any) {
        const error = apiErrorData.apiError;
        const gameId = error.gameTypeId;

        if (this.main.skipShowApiErrorGameIds.includes(gameId)) {
            return;
        }

        this.main.showErrorNotice(error);

        if (error.gameTypeId === SabaConfigs.games.TaiXiuTurbo.id && this.main.taiXiuTurbo && this.main.taiXiuTurbo.TX_Main) {
            this.main.taiXiuTurbo.TX_Main.onData(apiErrorData);
        }

        if (error.gameTypeId === SabaConfigs.games.BauCua.id && this.main.bauCua) {
            this.main.bauCua.onData(apiErrorData);
        }

        if (error.gameTypeId === SabaConfigs.games.ChanLe.id && this.main.chanLe) {
            this.main.chanLe.onData(apiErrorData);
        }

        if (error.gameTypeId === SabaConfigs.games.ChanLeTurbo.id && this.main.chanLeTurbo) {
            this.main.chanLeTurbo.onData(apiErrorData);
        }

        if (error.maxBet && error.maxBet > 0) {
            cc.RedT.userStakeLevelData(error);
        }
    }

    handleNoticeData(notice: any) {
        const noticeData = {
            text: notice.text,
            isInfo: false
        } as NoticeData;

        this.main.loading.node.active = false;
        this.main.showNotice(noticeData);
    }
}
