import { appContainer } from '../../../Application';
import BauCuaConfig from './BauCuaConfig';

export default class BauCuaModule {
    constructor() {
        appContainer.bind<BauCuaConfig>(BauCuaConfig).toSelf().inSingletonScope();
    }
}

new BauCuaModule();
