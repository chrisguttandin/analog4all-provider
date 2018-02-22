import {
    IAddInstrumentAction,
    IAddMidiConnectionAction,
    IRemoveInstrumentAction,
    IUpdateInstrumentAction,
    IUpdateMidiConnectionAction,
    IUpdateMidiOutputsAction
} from '../interfaces';

export type TStoreAction = IAddInstrumentAction |
    IAddMidiConnectionAction |
    IRemoveInstrumentAction |
    IUpdateInstrumentAction |
    IUpdateMidiConnectionAction |
    IUpdateMidiOutputsAction;
