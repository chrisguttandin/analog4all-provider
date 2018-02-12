import { NgModule } from '@angular/core';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // tslint:disable-line:no-implicit-dependencies
import { storeFreeze } from 'ngrx-store-freeze'; // tslint:disable-line:no-implicit-dependencies
import { environment } from '../../environments/environment';
import { appReducer } from './store';

const imports = (environment.production) ?
    [
        NgRxStoreModule.forRoot(appReducer)
    ] :
    [
        NgRxStoreModule.forRoot(appReducer, {
            metaReducers: [ storeFreeze ]
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 5
        })
    ];

@NgModule({
    imports
})
export class StoreModule { }
