import { Component, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { Column, HeaderCellType, Style, Klass } from '../../shared';
import { SimpleRenderer } from './simple-renderer.component';

@Component({
    selector: 'adg-header-cell',
    templateUrl: './header-cell.component.html',
    styleUrls: ['./header-cell.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderCellComponent {
    @Input() renderer: Function;
    @Input() column: Column;
    @Input() type: HeaderCellType;
    @Input() height: number | string;
    @Input() className: string;
    @Input() onResize: Function;
    @Input() onResizeEnd: Function;

    types = HeaderCellType;
    private resizing: boolean = false;

    onDragStart(e: any): void {
        this.resizing = true;
        if (e && e.dataTransfer && e.dataTransfer.setData) {
            // need to set dummy data for FF
            e.dataTransfer.setData('text/plain', 'dummy');
        }
    }

    onDrag(e: any): void {
        let resize = this.onResize || null;
        if (resize) {
            let width = e.left - this.column.left;
            if (width > 0) {
                resize(this.column, width);
            }
        }
    }

    onDragEnd(e: any): void {
        // let width = this.getWidthFromMouseEvent(e);
        // this.onResizeEnd(this.column, width);
        this.resizing = false;
    }

    getStyles(): Style {
        return {
            'width.px': this.column.width,
            'left.px': this.column.left,
            height: this.height,
            display: 'inline-block',
            position: 'absolute',
            margin: 0,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        };
    }

    getClasses(): Klass {
        // TODO: optimize this
        let classes = {
            'angular-grid-HeaderCell': true,
            'angular-grid-HeaderCell--resizing': this.resizing,
            'angular-grid-HeaderCell--locked': this.column.locked
        };

        if (this.className) {
            classes[this.className] = true;
        }

        return classes;
    }

    setScrollLeft(): void {

    }

    private getWidthFromMouseEvent(e: DragEvent): number {
        const right = e.pageX
        const left = 0;// ReactDOM.findDOMNode(this).getBoundingClientRect().left;
        return right - left;
    }
}
