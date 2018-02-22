import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // tslint:disable-line:no-implicit-dependencies
import { storeFreeze } from 'ngrx-store-freeze'; // tslint:disable-line:no-implicit-dependencies
import { environment } from '../../environments/environment';
import { watchMidiOutputs } from './actions';
import { InstrumentsEffects, MidiConnectionsEffects, MidiOutputsEffects } from './effects';
import { IAppState } from './interfaces';
import { InstrumentService } from './services';
import { appReducer } from './store';

const effects = [
    InstrumentsEffects,
    MidiConnectionsEffects,
    MidiOutputsEffects
];

const imports = (environment.production) ?
    [
        NgRxStoreModule.forRoot(appReducer),
        EffectsModule.forRoot(effects)
    ] :
    [
        NgRxStoreModule.forRoot(appReducer, {
            metaReducers: [ storeFreeze ]
        }),
        EffectsModule.forRoot(effects),
        StoreDevtoolsModule.instrument({
            maxAge: 5
        })
    ];

@NgModule({
    imports,
    providers: [
        InstrumentService
    ]
})
export class StoreModule {

    constructor (
        store: Store<IAppState>
    ) {
        store.dispatch(watchMidiOutputs());
    }

}
