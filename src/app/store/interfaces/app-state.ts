import { IInstrument, IMidiConnection } from '../../interfaces';

export interface IAppState {

    instruments: IInstrument[];

    midiConnections: IMidiConnection[];

    midiOutputs: WebMidi.MIDIOutput[];

}
