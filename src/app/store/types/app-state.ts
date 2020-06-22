import { TInstrument, TMidiConnection } from '../types';

export type TAppState = Readonly<{
    instruments: readonly TInstrument[];

    midiConnections: readonly TMidiConnection[];
}>;
