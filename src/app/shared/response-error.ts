import { HttpErrorResponse } from '@angular/common/http';

export class ResponseError extends Error {
    public code: string;

    constructor(response: HttpErrorResponse) {
        const {
            error: { code, message }
        } = response.error;

        super(message);

        this.code = code;
        this.name = 'ResponseError';
    }
}
