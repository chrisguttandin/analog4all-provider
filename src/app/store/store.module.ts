import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // tslint:disable-line:no-implicit-dependencies
import { storeFreeze } from 'ngrx-store-freeze'; // tslint:disable-line:no-implicit-dependencies
import { environment } from '../../environments/environment';
import { WindowService } from '../shared/window.service';
import { mergeMidiConnections, watchMidiOutputs } from './actions';
import { InstrumentsEffects, LocalStorageEffects, MidiConnectionsEffects, MidiOutputsEffects } from './effects';
import { ICacheableMidiConnection } from './interfaces';
import { appReducer } from './store';
import { TAppState } from './types';

@NgModule({
    imports: [
        CommonModule,
        (environment.production)
            ? NgRxStoreModule.forRoot(appReducer)
            : NgRxStoreModule.forRoot(appReducer, { metaReducers: [ storeFreeze ] }),
        EffectsModule.forRoot([
            InstrumentsEffects,
            LocalStorageEffects,
            MidiConnectionsEffects,
            MidiOutputsEffects
        ]),
        (environment.production)
            ? [ ]
            : StoreDevtoolsModule.instrument({ maxAge: 50 })
    ]
})
export class StoreModule {

    constructor (
        store: Store<TAppState>,
        windowService: WindowService
    ) {
        const stringifiedMidiConnections = (windowService.nativeWindow === null)
            ? null
            : windowService.nativeWindow.localStorage.getItem('midiConnections');

        if (stringifiedMidiConnections !== null) {
            const midiConnections: ICacheableMidiConnection[] = JSON.parse(stringifiedMidiConnections);

            // @todo Validate midiConnections.

            store.dispatch(mergeMidiConnections(midiConnections.map((midiConnection) => ({ ...midiConnection, isConnected: false }))));
        }

        store.dispatch(watchMidiOutputs());
    }

}
