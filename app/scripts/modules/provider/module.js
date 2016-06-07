import { ProviderController } from './controllers/provider';
import angular from 'angular';
import browser from '../browser/module';
import localRegistry from '../local-registry/module';
import { provider } from './components/provider';
import slot from '../slot/module';

export default angular
    .module('provider', [
        browser.name,
        localRegistry.name,
        slot.name
    ])

    .component('provider', provider)

    .controller('ProviderController', [ 'browserService', ProviderController ]);
