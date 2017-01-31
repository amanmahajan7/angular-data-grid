import { Component, Inject, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'draggable',
    templateUrl: './draggable.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableComponent implements OnInit, OnDestroy {
    @Input() style: Object;

    @Output() onDragStart: EventEmitter<any> = new EventEmitter();
    @Output() onDragEnd: EventEmitter<any> = new EventEmitter();
    @Output() onDrag: EventEmitter<any> = new EventEmitter();

    drag: Object = null;
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

    private initMouseEvents(): void {
        this.mouseup = fromEvent(this.el.nativeElement, 'mouseup');
        this.mousedown = fromEvent(this.el.nativeElement, 'mousedown');
        this.mousemove = fromEvent(this.document, 'mousemove');

        this.mousedrag = this
            .mousedown
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
                    }).takeUntil(this.mouseup);
            });
    }

    private handleDrag(): void {
        this.mousedragSubscription =
            this.mousedown.subscribe((point: {}) => this.onDrag.emit(point));
    }
} 