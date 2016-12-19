import { Injectable } from '@angular/core';

@Injectable()
export class DownloadingService {

    public download (fileName, ...arrayBuffers) {
        const file = new File(arrayBuffers, fileName, { type: 'audio/wav' });

        const link$ = document.createElement('a');

        link$.setAttribute('href', URL.createObjectURL(file));
        link$.setAttribute('download', fileName);

        document.body.appendChild(link$);
        link$.click();
        document.body.removeChild(link$);
    }

}
