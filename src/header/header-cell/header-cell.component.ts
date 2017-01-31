import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { Column } from '../../shared';

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
    @Input() column: Column;
    @Input() height: number;
    @Input() width: number;
    @Input() left: number;
    @Input() className: string;

    @Input() onResize: Function;
    @Input() onResizeEnd: Function;

    private resizing: boolean = false;

    onDragStart(e: DragEvent): void {
        this.resizing = true;
        if (e && e.dataTransfer && e.dataTransfer.setData) {
            // need to set dummy data for FF
            e.dataTransfer.setData('text/plain', 'dummy');
        }
    }

    onDrag(e: DragEvent): void {
        let resize = this.onResize || null;
        if (resize) {
            let width = this.getWidthFromMouseEvent(e);
            if (width > 0) {
                resize(this.column, width);
            }
        }
    }

    onDragEnd(e: DragEvent): void {
        let width = this.getWidthFromMouseEvent(e);
        this.onResizeEnd(this.column, width);
        this.resizing = false;
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

    getClasses(): Object {
        return {
            'angular-grid-HeaderCell': true,
            'angular-grid-HeaderCell--resizing': this.resizing,
            'angular-grid-HeaderCell--locked': this.column.locked
        };
    }

    setScrollLeft(): void {

    }

    private getWidthFromMouseEvent(e: DragEvent): number {
        const right = e.pageX
        const left = 0;// ReactDOM.findDOMNode(this).getBoundingClientRect().left;
        return right - left;
    }
}
