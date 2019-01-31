import { TInstrument, TMidiConnection } from '../types';

export type TAppState = Readonly<{

    instruments: TInstrument[];

    midiConnections: TMidiConnection[];

}>;
