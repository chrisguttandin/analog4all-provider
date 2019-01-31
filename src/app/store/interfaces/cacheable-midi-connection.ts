import { TMidiConnection } from '../types';

export interface ICacheableMidiConnection {

    description?: TMidiConnection['description'];

    gearogsSlug?: TMidiConnection['gearogsSlug'];

    midiOutputId: TMidiConnection['midiOutputId'];

    midiOutputName: TMidiConnection['midiOutputName'];

    name: TMidiConnection['name'];

    soundCloudUsername?: TMidiConnection['soundCloudUsername'];

    sourceId: TMidiConnection['sourceId'];

}
