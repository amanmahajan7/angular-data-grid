import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { ExcelColumn } from '../shared';

type Style = {
    width: number;
    left: number;
    display: string;
    position: string;
    overflow?: string;
    height: number;
    margin: number;
    textOverflow: string;
    whiteSpace: string
}

@Component({
    selector: 'header-cell',
    templateUrl: './header-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderCellComponent {
    @Input() renderer: Function;
    @Input() column: ExcelColumn;
    @Input() height: number;
    @Input() width: number;
    @Input() left: number;
    @Input() className: string;
    @Input() onResize: Function;
    @Input() onResizeEnd: Function;

    private resizing: boolean = false;

    onDragStart(): void {

    }

    onDragEnd(): void {

    }

    getWidthFromMouseEvent(): number {
        return 0;
    }

    getCell(): void {

    }

    getStyle(): Style {
        return {
            width: this.width,
            height: this.height,
            left: this.left,
            display: 'inline-block',
            position: 'absolute',
            margin: 0,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        };
    }

    setScrollLeft(): void {

    }
}