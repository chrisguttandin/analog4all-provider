import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { DescriptionInputComponent } from './description-input/description-input.component';
import { GearogsSlugInputComponent } from './gearogs-slug-input/gearogs-slug-input.component';
import { InstrumentNameInputComponent } from './instrument-name-input/instrument-name-input.component';
import { LocalRegistryComponent } from './local-registry/local-registry.component';
import { MidiConnectionComponent } from './midi-connection/midi-connection.component';
import { ENDPOINT } from './shared';
import { SoundCloudUsernameInputComponent } from './sound-cloud-username-input/sound-cloud-username-input.component';
import { SourceIdSelectComponent } from './source-id-select/source-id-select.component';
import { StoreModule } from './store';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        DescriptionInputComponent,
        GearogsSlugInputComponent,
        InstrumentNameInputComponent,
        LocalRegistryComponent,
        MidiConnectionComponent,
        SoundCloudUsernameInputComponent,
        SourceIdSelectComponent
    ],
    imports: [BrowserModule, FormsModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: !ngDevMode }), StoreModule],
    providers: [
        { provide: ENDPOINT, useValue: '://jbnw79pt56.execute-api.eu-west-1.amazonaws.com/dev/' },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule {}
