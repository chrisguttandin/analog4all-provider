import {
    IAddInstrumentAction,
    IDeleteInstrumentAction,
    IDeleteInstrumentFailAction,
    IDeleteInstrumentSuccessAction,
    IMergeMidiConnectionsAction,
    IPatchInstrumentAction,
    IPatchInstrumentFailAction,
    IPatchInstrumentSuccessAction,
    IRemoveInstrumentAction,
    IUpdateInstrumentAction,
    IUpdateMidiConnectionAction,
    IWatchMidiOutputsAction
} from '../interfaces';

export type TStoreAction =
    | IAddInstrumentAction
    | IDeleteInstrumentAction
    | IDeleteInstrumentFailAction
    | IDeleteInstrumentSuccessAction
    | IMergeMidiConnectionsAction
    | IPatchInstrumentAction
    | IPatchInstrumentFailAction
    | IPatchInstrumentSuccessAction
    | IRemoveInstrumentAction
    | IUpdateInstrumentAction
    | IUpdateMidiConnectionAction
    | IWatchMidiOutputsAction;
