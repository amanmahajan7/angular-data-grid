import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { SortDirection } from '../shared';

@Component({
    selector: 'sortable-header-cell',
    templateUrl: './sortable-header-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortableHeaderCellComponent {
    @Input() columnKey: string;
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
        switch (this.sortDirection) {
            default:
            case null:
            case undefined:
            case SortDirection.NONE:
                return '';
            case SortDirection.ASC:
                return String.fromCharCode(9650);
            case SortDirection.DESC:
                return String.fromCharCode(9660);
        }
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
