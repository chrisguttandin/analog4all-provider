import { InstrumentsService } from './services/instruments';
import { PeerConnectingService } from './services/peer-connecting';
import angular from 'angular';

export default angular
    .module('instruments', [])

    .service('instrumentsService', [ '$http', 'peerConnectingService', InstrumentsService ])
    .service('peerConnectingService', [ PeerConnectingService ]);
