import * as i18n from "LanguageData";
import ErrorCodeDictionary, { CommonErrorCodeList } from "./ErrorCodeDictionary";
import { getLocale } from "../../common/auth/SessionManager";

export default class NoticeUtil {
    public static getLocalizedErrorMessage(errorCode: string, opt: any, isPlaceBet = false): string {
        if (!ErrorCodeDictionary[errorCode]) {
            console.error(`not found error code ${errorCode}`);
            return i18n.t("messages.errorOccurred", opt);
        }
        let key = `messages.${ErrorCodeDictionary[errorCode]}`;
        const isCommonErrorCode = CommonErrorCodeList.includes(errorCode);
        if (isCommonErrorCode && isPlaceBet) {
            key += "PlaceBet";
        }
        return i18n.t(key, opt);
    }

    public static getMessageByLocale(data: any): string {
        const locale = getLocale();
        return data[locale] || data["en-US"];
    }
}
