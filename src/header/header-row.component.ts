import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { SortDirection, CellMetadata } from '../shared';

@Component({
    selector: 'header-row',
    templateUrl: './header-row.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderRowComponent {
}