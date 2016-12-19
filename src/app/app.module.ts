import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
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
import { SourceIdSelectComponent } from './source-id-select/source-id-select.component';
import { StoreModule } from './store';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        LocalRegistryComponent,
        MidiConnectionComponent,
        InstrumentNameInputComponent,
        SourceIdSelectComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StoreModule
    ],
    providers: [
        AudioInputMediaDevicesService,
        DownloadingService,
        { provide: ENDPOINT, useValue: '://analog4all-registry.eu-west-1.elasticbeanstalk.com/' },
        FileReceivingService,
        FileSendingService,
        InstrumentsService,
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
