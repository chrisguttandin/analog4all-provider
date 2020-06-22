import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DownloadingService {
    public download(fileName: string, blob: Blob): void {
        const file = new File([blob], fileName, { type: 'audio/wav' });

        const link$ = document.createElement('a');

        link$.setAttribute('href', URL.createObjectURL(file));
        link$.setAttribute('download', fileName);

        document.body.appendChild(link$);
        link$.click();
        document.body.removeChild(link$);
    }
}
