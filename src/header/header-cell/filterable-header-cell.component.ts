import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Column } from '../../shared';

@Component({
    selector: 'adg-filterable-header-cell',
    templateUrl: './filterable-header-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterableHeaderCellComponent implements OnInit {
    @Input() column: Column;
    @Output() onChange: EventEmitter<any> = new EventEmitter();

    filterTerm: FormControl = new FormControl('');

    ngOnInit(): void {
        this
            .filterTerm
            .valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe((val: string) => this.onChange.emit({ filterTerm: val, column: this.column }));
    }
}