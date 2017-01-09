import { Component, Input, HostListener, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

@Component({
    selector: 'draggable',
    templateUrl: './draggable.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableComponent implements OnDestroy {
    @Input() style: Object;

    onMouseDown(): void {

    }

    onMouseMove(): void {

    }

    onMouseUp(): void {

    }

    cleanUp(): void {

    }

    ngOnDestroy(): void {
        this.cleanUp();
    }
} 