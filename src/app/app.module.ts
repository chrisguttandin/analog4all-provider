import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DescriptionInputComponent } from './description-input/description-input.component';
import { GearogsSlugInputComponent } from './gearogs-slug-input/gearogs-slug-input.component';
import { InstrumentNameInputComponent } from './instrument-name-input/instrument-name-input.component';
import { LocalRegistryComponent } from './local-registry/local-registry.component';
import { MidiConnectionComponent } from './midi-connection/midi-connection.component';
import {
    AudioInputMediaDevicesService,
    DownloadingService,
    ENDPOINT,
    FileReceivingService,
    FileSendingService,
    InstrumentsService,
    MicrophonePermissionStateService,
    MiddleCMidiJsonService,
    MidiAccessService,
    MidiConnectionsService,
    MidiOutputsService,
    PeerConnectingService,
    RecordingService,
    RegisteringService,
    RenderingService,
    SamplesService,
    ScaleMidiJsonService,
    UserMediaService,
    WaitingService,
    WindowService
} from './shared';
import { SoundCloudUsernameInputComponent } from './sound-cloud-username-input/sound-cloud-username-input.component';
import { SourceIdSelectComponent } from './source-id-select/source-id-select.component';
import { StoreModule } from './store';

@NgModule({
    bootstrap: [
        AppComponent
    ],
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
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        StoreModule
    ],
    providers: [
        AudioInputMediaDevicesService,
        DownloadingService,
        { provide: ENDPOINT, useValue: '://w8flhge089.execute-api.eu-west-1.amazonaws.com/dev/' },
        FileReceivingService,
        FileSendingService,
        InstrumentsService,
        MicrophonePermissionStateService,
        MiddleCMidiJsonService,
        MidiAccessService,
        MidiConnectionsService,
        MidiOutputsService,
        PeerConnectingService,
        RecordingService,
        RegisteringService,
        RenderingService,
        SamplesService,
        ScaleMidiJsonService,
        UserMediaService,
        WaitingService,
        WindowService
    ]
})
export class AppModule { }
