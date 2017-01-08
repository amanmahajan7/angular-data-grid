import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'simple-cell-formatter',
    template: './simple-cell-formatter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleCellFormatterComponent {
    @Input() value: string | number | boolean | Object;
}