import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class GridService {
    private scrollbarSize: number;
    private readonly document: Document;

    constructor( @Inject(DOCUMENT) document: any) {
        this.document = <Document>document;
    }

    getScrollbarSize(): number {
        if (this.scrollbarSize === undefined) {
            const outer = this.document.createElement('div');
            outer.style.width = '50px';
            outer.style.height = '50px';
            outer.style.position = 'absolute';
            outer.style.top = '-200px';
            outer.style.left = '-200px';

            const inner = this.document.createElement('div');
            inner.style.height = '100px';
            inner.style.width = '100%';

            outer.appendChild(inner);
            this.document.body.appendChild(outer);

            const outerWidth = outer.clientWidth;
            outer.style.overflowY = 'scroll';
            const innerWidth = inner.clientWidth;

            this.document.body.removeChild(outer);

            this.scrollbarSize = outerWidth - innerWidth;
        }

        return this.scrollbarSize;
    }
}
