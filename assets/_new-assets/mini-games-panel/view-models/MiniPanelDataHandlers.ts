import { NoticeData } from "../../common/notice/view-models/Notice";
import * as SabaConfigs from "../../SabaConfigs";
import * as authManager from "./../../common/auth/AuthManager";
import MiniPanel from "./MiniPanel";

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

        if (data.gameResult) {
            const { redirectUrl } = data.gameResult;
            this.main.openResultPage(redirectUrl);
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
            const noticeData = <NoticeData>{ text: data.message };
            this.main.showNotice(noticeData, this.main.forceKickedOut, this.main.forceKickedOut);
        }
    }

    handleDataApiError(apiErrorData: any) {
        var error = apiErrorData.apiError;
        this.main.showErrorNotice(error);

        if (error.gameTypeId === SabaConfigs.games.TaiXiu.id && this.main.taiXiu && this.main.taiXiu.TX_Main) {
            this.main.taiXiu.TX_Main.onData(apiErrorData);
        }

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
    }

    handleNoticeData(notice: any) {
        const noticeData = <NoticeData>{
            text: notice.text,
            isInfo: false
        };

        this.main.loading.node.active = false;
        this.main.showNotice(noticeData);
    }
}
