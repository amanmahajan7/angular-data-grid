import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Column, SortDirection } from '../shared';

@Component({
    selector: 'sortable-header-cell',
    templateUrl: './sortable-header-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortableHeaderCellComponent {
    @Input() columnKey: string;
    @Input() column: Column;
    @Input() sortDirection: SortDirection;

    @Output() onSort: EventEmitter<any> = new EventEmitter();

    getClass(): Object {
        return {
            'angular-grid-HeaderCell-sortable': true,
            'angular-grid-HeaderCell-sortable--ascending': this.sortDirection === SortDirection.ASC,
            'angular-grid-HeaderCell-sortable--descending': this.sortDirection === SortDirection.DESC
        };
    }

    getSortByText(): string {
        const unicodeKeys = {
            [SortDirection.ASC]: 9650,
            [SortDirection.DESC]: 9660
        };

        return this.sortDirection === SortDirection.NONE ? '' : String.fromCharCode(unicodeKeys[this.sortDirection]);
    }

    onClick(): void {
        let direction;
        switch (this.sortDirection) {
            default:
            case null:
            case undefined:
            case SortDirection.NONE:
                direction = SortDirection.ASC;
                break;
            case SortDirection.ASC:
                direction = SortDirection.DESC;
                break;
            case SortDirection.DESC:
                direction = SortDirection.NONE;
                break;
        }

        this.onSort.emit({
            columnKey: this.columnKey,
            direction: direction
        });
    }
}
