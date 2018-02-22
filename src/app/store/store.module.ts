import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // tslint:disable-line:no-implicit-dependencies
import { storeFreeze } from 'ngrx-store-freeze'; // tslint:disable-line:no-implicit-dependencies
import { environment } from '../../environments/environment';
import { InstrumentsEffects } from './effects';
import { InstrumentService } from './services';
import { appReducer } from './store';

const effects = [
    InstrumentsEffects
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
export class StoreModule { }
