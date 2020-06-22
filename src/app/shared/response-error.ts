import { HttpErrorResponse } from '@angular/common/http';

export class ResponseError extends Error {
    public code: string;

    constructor(response: HttpErrorResponse) {
        super();

        const {
            error: { code, message }
        } = response.error;

        this.code = code;
        this.message = message;
    }
}
