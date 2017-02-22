import { Component, Inject, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';

import { Style } from '../../shared';

@Component({
    selector: 'adg-resize-handle',
    templateUrl: './resize-handle.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizeHandleComponent {
    @Output() dragStart: EventEmitter<any> = new EventEmitter();
    @Output() dragEnd: EventEmitter<any> = new EventEmitter();
    @Output() drag: EventEmitter<any> = new EventEmitter();

    // drag: Object = null;

    private mouseup: Observable<any>;
    private mousedown: Observable<any>;
    private mousemove: Observable<any>;
    private mousedrag: Observable<any>;
    private mousedragSubscription: Subscription;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private el: ElementRef) {
    }

    ngOnInit(): void {
        this.initMouseEvents();
        this.handleDrag();
    }

    ngOnDestroy(): void {
        this.mousedragSubscription.unsubscribe();
    }

    getStyles(): Style {
        return {
            position: 'absolute',
            'top.px': 0,
            'right.px': 0,
            'width.px': 6,
            'height.%': 100
        };
    }

    private initMouseEvents(): void {
        this.mousedown = fromEvent(this.el.nativeElement, 'mousedown');
        this.mousemove = fromEvent(this.document, 'mousemove');
        this.mouseup = fromEvent(this.document, 'mouseup');

        this.mousedrag = this
            .mousedown
            .do(() => this.dragStart.emit())
            .mergeMap((md: MouseEvent) => {
                // Capture mouse down offset position
                const startX = md.offsetX;
                const startY = md.offsetY;

                // Track mouse position differentials using mousemove until we hear a mouseup
                return this
                    .mousemove
                    .map((mm: MouseEvent) => {
                        mm.preventDefault();

                        return {
                            left: mm.clientX - startX,
                            top: mm.clientY - startY
                        };
                        // Stop the drag when mouseup
                    })
                    .takeUntil(this.mouseup)
                    .finally(() => this.dragEnd.emit());
            });
    }

    private handleDrag(): void {
        this.mousedragSubscription =
            this.mousedrag.subscribe((coordinate: {}) => this.drag.emit(coordinate));
    }
}