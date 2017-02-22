import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { SortDirection, Column, CellMetadata, HeaderCellType, Style } from '../shared';
import { GridService } from '../shared/grid.service';

@Component({
    selector: 'adg-header-row',
    templateUrl: './header-row.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [GridService] // TODO: MOVE IT TO GRID COMPONENT
})
export class HeaderRowComponent {
    @Input() width: number;
    @Input() height: number | string;
    @Input() columns: Column[];
    @Input() onColumnResize: Function;
    @Input() onSort: Function;
    @Input() onColumnResizeEnd: Function;
    @Input() style: Style;
    @Input() sortColumn: string;
    @Input() sortDirection: SortDirection;
    @Input() cellRenderer: Function;
    @Input() headerCellRenderer: Function;
    @Input() filterable: boolean;
    @Input() onFilterChange: Function;
    @Input() resizing: Object;
    @Input() onScroll: Function;
    @Input() rowType: string;
    @Input() draggableHeaderCell: Function;

    constructor(private gridService: GridService) { }

    getHeaderCellType(column: Column): HeaderCellType {
        if (column.filterable) {
            if (this.filterable) {
                return HeaderCellType.Filterable
            };
        }

        if (column.sortable) {
            return HeaderCellType.Sortable;
        }

        return HeaderCellType.None;
    }

    // getStyle(): Style {
    //     return {
    //         overflow: 'hidden',
    //         'width.%': 100,
    //         height: this.height,
    //         position: 'absolute'
    //     };
    // }

    getCells(): any {
        let cells: any = [];
        let lockedCells: any = [];

        for (let column of this.columns) {
            if (column.locked) {
                // lockedCells.push(cell);
            } else {
                // cells.push(cell);
            }
        }

        return cells.concat(lockedCells);
    }

    getStyles(): Style {
        return {
            width: this.width ? ((this.width + this.gridService.getScrollbarSize()) + 'px') : '100%',
            height: this.height,
            whiteSpace: 'nowrap',
            overflowX: 'hidden',
            overflowY: 'hidden'
        };
    }
}