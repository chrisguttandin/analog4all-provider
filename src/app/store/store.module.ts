import { NgModule } from '@angular/core';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { appReducer } from './store';

@NgModule({
    imports: [
        NgRxStoreModule.forRoot(appReducer)
    ]
})
export class StoreModule { }
