import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'resize-handle',
    templateUrl: './resize-handle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizeHandleComponent {
    getStyle(): Object {
        return {
            position: 'absolute',
            top: 0,
            right: 0,
            width: 6,
            height: '100%'
        };
    }
}