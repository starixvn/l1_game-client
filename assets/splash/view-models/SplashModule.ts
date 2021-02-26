import { appContainer } from '../../Application';
import SplashConfig from './SplashConfig';

export default class SplashModule {
    constructor() {
        appContainer.bind<SplashConfig>(SplashConfig).toSelf().inSingletonScope();
    }
}

new SplashModule();
