import { appContainer } from '../../Application';
import FourGuardiansConfig from './scripts/FourGuardiansConfig';

export default class FourGuardiansModule {
    constructor() {
        appContainer.bind<FourGuardiansConfig>(FourGuardiansConfig).toSelf().inSingletonScope();
    }
}

new FourGuardiansModule();
