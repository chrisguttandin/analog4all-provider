import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { WindowService } from '../shared/window.service';
import { mergeMidiConnections, watchMidiOutputs } from './actions';
import { InstrumentsEffects, LocalStorageEffects, MidiConnectionsEffects, MidiOutputsEffects } from './effects';
import { ICacheableMidiConnection } from './interfaces';
import { appReducer } from './store';
import { TAppState } from './types';

@NgModule({
    imports: [
        CommonModule,
        NgRxStoreModule.forRoot(appReducer, {
            runtimeChecks: {
                strictActionImmutability: !!ngDevMode,
                strictActionSerializability: !!ngDevMode,
                strictActionTypeUniqueness: !!ngDevMode,
                strictStateImmutability: !!ngDevMode,
                strictStateSerializability: !!ngDevMode
            }
        }),
        EffectsModule.forRoot([InstrumentsEffects, LocalStorageEffects, MidiConnectionsEffects, MidiOutputsEffects]),
        ngDevMode ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : []
    ],
    providers: [
        {
            deps: [Store],
            multi: true,
            provide: APP_INITIALIZER,
            useFactory: (store: Store<TAppState>) => () => store.dispatch(watchMidiOutputs())
        },
        {
            deps: [Store, WindowService],
            multi: true,
            provide: APP_INITIALIZER,
            useFactory: (store: Store<TAppState>, windowService: WindowService) => () => {
                const stringifiedMidiConnections =
                    windowService.nativeWindow === null ? null : windowService.nativeWindow.localStorage.getItem('midiConnections');

                if (stringifiedMidiConnections !== null) {
                    const midiConnections: ICacheableMidiConnection[] = JSON.parse(stringifiedMidiConnections);
                    const unconnectedMidiConnections = midiConnections.map((midiConnection) => ({ ...midiConnection, isConnected: false }));

                    // @todo Validate midiConnections.

                    store.dispatch(mergeMidiConnections(unconnectedMidiConnections));
                }
            }
        }
    ]
})
export class StoreModule {}
