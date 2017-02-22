import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { Column, SortDirection, Style } from '../../shared';

@Component({
    selector: 'adg-sortable-header-cell',
    templateUrl: './sortable-header-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortableHeaderCellComponent {
    @Input() columnKey: string;
    @Input() column: Column;
    @Input() sortDirection: SortDirection;

    @Output() onSort: EventEmitter<any> = new EventEmitter();

    getClasses(): Style {
        return {
            'angular-grid-HeaderCell-sortable': true,
            'angular-grid-HeaderCell-sortable--ascending': this.sortDirection === SortDirection.Asc,
            'angular-grid-HeaderCell-sortable--descending': this.sortDirection === SortDirection.Desc
        };
    }

    getSortByText(): string {
        const unicodeKeys = {
            [SortDirection.Asc]: 9650,
            [SortDirection.Desc]: 9660
        };

        return this.sortDirection === SortDirection.None ? '' : String.fromCharCode(unicodeKeys[this.sortDirection]);
    }

    onClick(): void {
        let direction;
        switch (this.sortDirection) {
            default:
            case null:
            case undefined:
            case SortDirection.None:
                direction = SortDirection.Asc;
                break;
            case SortDirection.Asc:
                direction = SortDirection.Desc;
                break;
            case SortDirection.Desc:
                direction = SortDirection.None;
                break;
        }

        this.onSort.emit({
            columnKey: this.columnKey,
            direction: direction
        });
    }
}
