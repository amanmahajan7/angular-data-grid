import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'cell-expander',
    template: './cell-expander.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellExpanderComponent {
    @Input() treeDepth?: number;

    marginLeft: number = 0;
    expanded: boolean = false;

    getStyle(): Object {
        return {
            'float': 'left',
            'margin-left': this.treeDepth ? `${this.treeDepth * 30}px` : `0`
        };
    }

    get character(): string {
        return this.expanded ? String.fromCharCode(9660) : String.fromCharCode(9658);
    }
}