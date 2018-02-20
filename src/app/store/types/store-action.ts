import {
    IAddInstrumentAction,
    IAddMidiConnectionAction,
    IDeleteInstrumentAction,
    IUpdateInstrumentAction,
    IUpdateMidiConnectionAction,
    IUpdateMidiOutputsAction
} from '../interfaces';

export type TStoreAction = IAddInstrumentAction |
    IAddMidiConnectionAction |
    IDeleteInstrumentAction |
    IUpdateInstrumentAction |
    IUpdateMidiConnectionAction |
    IUpdateMidiOutputsAction;
