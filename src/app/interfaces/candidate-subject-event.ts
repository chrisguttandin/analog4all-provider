import { IStringifyableJsonObject } from 'rxjs-broker';

export interface ICandidateSubjectEvent extends IStringifyableJsonObject {

    candidate: RTCIceCandidate | {

        candidate: string;

        sdpMid: null | string;

        sdpMLineIndex: null | number;

        ufrag: string;

    };

}
