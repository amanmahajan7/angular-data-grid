import { Component, Input, Output, ChangeDetectionStrategy, OnChanges } from '@angular/core';

import { SortDirection, CellMetadata } from '../shared';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnChanges {
    @Input() columnMetrics: { width: number, columns: any };
    @Input() totalWidth: number | string;
    @Input() height: number;
    @Input() headerRows: any[];
    @Input() sortColumn: string;
    @Input() sortDirection: SortDirection;
    @Input() onSort: Function;
    // @Input() onColumnResize: Function;
    @Input() onScroll: Function;
    @Input() draggableHeaderCell: Function;
    @Input() getValidFilterValues: Function;
    @Input() cellMetaData: CellMetadata

    private resizing: boolean = false;

    ngOnChanges(): void {

    }

    onColumnResize(): void {

    }

    onColumnResizeEnd(): void {

    }

    getHeaderRows(): void {

    }

    getColumnMetrics(): void {

    }

    getColumnPosition(): void {

    }

    getStyle(): { position: string; height: number } {
        return {
            position: 'relative',
            height: this.getCombinedHeaderHeights()
        };
    }

    getHeaderClass(): Object {
        return {
            'react-grid-Header': true,
            'react-grid-Header--resizing': this.resizing
        };
    }

    setScrollLeft(): void {

    }

    getKnownDivProps(): void {

    }

    onHeaderClick(): void {

    }

    private getCombinedHeaderHeights(until?: number): number {
        let stopAt = this.headerRows.length;
        if (typeof until !== 'undefined') {
            stopAt = until;
        }

        let height = 0;
        for (let index = 0; index < stopAt; index++) {
            height += this.headerRows[index].height || this.height;
        }
        return height;
    }
}