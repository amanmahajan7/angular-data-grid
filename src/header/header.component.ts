import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { SortDirection, CellMetadata } from '../shared';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    @Input() columnMetrics: { width: number, columns: any };
    @Input() totalWidth: number | string;
    @Input() height: number;
    @Input() headerRows: any[];
    @Input() sortColumn: string;
    @Input() sortDirection: string;
    @Input() onSort: Function;
    // @Input() onColumnResize: Function;
    @Input() onScroll: Function;
    @Input() draggableHeaderCell: Function;
    @Input() getValidFilterValues: Function;
    @Input() cellMetaData: CellMetadata

    private resizing: boolean = false;

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

    getCombinedHeaderHeights(): void {

    }

    getStyle(): void {

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
}