import { IStringifyableJsonObject } from 'rxjs-broker';

export interface IDescriptionSubjectEvent extends IStringifyableJsonObject {

    description: RTCSessionDescription | {

        sdp: string | null;

        type: string;

    };

}
