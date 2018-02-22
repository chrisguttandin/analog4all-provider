import {
    IAddInstrumentAction,
    IMergeMidiConnectionsAction,
    IRemoveInstrumentAction,
    IUpdateInstrumentAction,
    IUpdateMidiConnectionAction
} from '../interfaces';

export type TStoreAction = IAddInstrumentAction |
    IMergeMidiConnectionsAction |
    IRemoveInstrumentAction |
    IUpdateInstrumentAction |
    IUpdateMidiConnectionAction;
