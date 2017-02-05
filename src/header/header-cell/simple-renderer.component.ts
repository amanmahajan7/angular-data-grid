import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { Column } from '../../shared';

@Component({
    selector: 'adg-simple-renderer',
    templateUrl: './simple-renderer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleRenderer {
    @Input() column: Column;
}