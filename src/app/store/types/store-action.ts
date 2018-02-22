import {
    IAddInstrumentAction,
    IAddMidiConnectionAction,
    IMergeMidiConnectionsAction,
    IRemoveInstrumentAction,
    IUpdateInstrumentAction,
    IUpdateMidiConnectionAction,
    IUpdateMidiOutputsAction
} from '../interfaces';

export type TStoreAction = IAddInstrumentAction |
    IAddMidiConnectionAction |
    IMergeMidiConnectionsAction |
    IRemoveInstrumentAction |
    IUpdateInstrumentAction |
    IUpdateMidiConnectionAction |
    IUpdateMidiOutputsAction;
