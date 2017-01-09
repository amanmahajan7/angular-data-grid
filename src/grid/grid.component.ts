import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { CellMetadata, SortDirection } from '../shared';

@Component({
    selector: 'grid',
    templateUrl: './grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseGridComponent {
    @Input() rowGetter: Function;
    @Input() columns: Object | any[];
    @Input() columnMetrics: Object;
    @Input() minHeight: number = 350;
    @Input() totalWidth: number | string;
    @Input() headerRows: any[] | Function;
    @Input() rowHeight: number = 35;
    @Input() rowRenderer: any;
    @Input() emptyRowsView: Function;
    @Input() expandedRows: any[] | Function;
    @Input() selectedRows: any[] | Function;
    @Input() rowSelection: any;
    @Input() rowsCount: number;
    @Input() onRows: Function;
    @Input() sortColumn: string;
    @Input() sortDirection: SortDirection;
    @Input() rowOffsetHeight: number;
    @Input() onViewportKeydown: Function;
    @Input() onViewportKeyup: Function;
    @Input() onViewportDragStart: Function;
    @Input() onViewportDragEnd: Function;
    @Input() onViewportDoubleClick: Function;
    @Input() onColumnResize: Function;
    @Input() onSort: Function;
    @Input() cellMetaData: CellMetadata;
    @Input() rowKey: string;
    @Input() rowScrollTimeout?: number;
    @Input() contextMenu: any;
    @Input() getSubRowDetails: Function;
    @Input() draggableHeaderCell: Function;
    @Input() getValidFilterValues: Function;
    @Input() rowGroupRenderer: Function;
    @Input() overScan: Object;

    constructor() { }

    hasRows(): boolean {
        return this.rowsCount >= 1 || (this.rowsCount === 0 && !this.emptyRowsView);
    }

    private getStyle(): { overflow: string; outline: number; position: string; minHeight: number; } {
        return {
            overflow: 'hidden',
            outline: 0,
            position: 'relative',
            minHeight: this.minHeight
        };
    }
}