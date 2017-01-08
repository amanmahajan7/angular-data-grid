import {
    Component, OnInit, OnChanges, OnDestroy, AfterViewInit,
    Input, SimpleChanges, ChangeDetectionStrategy, Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { isEqual, isFunction } from 'lodash';
import * as joinClasses from 'classnames';

import { ExpandableOptions } from './expandable-options.model';
import { CellMetadata, Column, ExcelColumn, RowData } from '../shared';

// The list of the propTypes that we want to include in the Cell div
const knownDivPropertyKeys = ['height', 'tabIndex', 'value'];

@Component({
    selector: 'cell',
    template: './cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    @Input() rowIdx: number;
    @Input() idx: number;
    @Input() selected: { idx: number };
    @Input() selectedColumn: Column;
    @Input() height: number;
    @Input() width: number;
    @Input() left: number;
    @Input() tabIndex: number = -1;
    @Input() ref: string;
    @Input() column: Column;
    @Input() value: string | number | boolean | Object = '';
    @Input() isExpanded: boolean;
    @Input() isRowSelected: boolean;
    @Input() cellMetaData: CellMetadata;
    @Input() cellClass: string;
    @Input() className: string;
    @Input() cellControls: any;
    @Input() rowData: RowData;
    @Input() forceUpdate: boolean;
    @Input() expandableOptions: ExpandableOptions;
    @Input() isScrolling: boolean;

    private isCellValueChanging: boolean = false;

    constructor( @Inject(DOCUMENT) private document: any) { }

    // Lifecyle hooks
    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value']) {
            this.isCellValueChanging = changes['value'].currentValue !== this.value;
        }
    }

    ngAfterViewInit() {
        this.checkFocus();
    }

    ngOnDestroy() { }

    onCellClick($event: any) {

    }

    onCellContextMenu($event: any) {

    }

    onCellDoubleClick($event: any) {

    }

    onCellExpand($event: any) {

    }

    onCellKeyDown($event: any) {

    }

    onDragHandleDoubleClick($event: any) {

    }

    onDragOver($event: any) {
    }

    private getStyle(): {} {
        let style = {
            position: 'absolute',
            width: this.column.width,
            height: this.height,
            left: this.column.left,
            contain: 'layout'
        };

        return style;
    }

    private getFormatter(): any {
    }

    private getRowData(rowData = this.rowData) {
        return rowData.toJSON ? rowData.toJSON() : rowData;
    }

    private getFormatterDependencies() {
        // convention based method to get corresponding Id or Name of any Name or Id property
        if (typeof this.column.getRowMetaData === 'function') {
            return this.column.getRowMetaData(this.getRowData(), this.column);
        }
    }

    private getCellClass() {
        let className = joinClasses(
            this.column.cellClass,
            'angular-grid-Cell',
            this.className,
            this.column.locked ? 'angular-grid-Cell--locked' : null
        );
        let extraClasses = joinClasses({
            'row-selected': this.isRowSelected,
            editing: this.isActive(),
            copied: this.isCopied() || this.wasDraggedOver() || this.isDraggedOverUpwards() || this.isDraggedOverDownwards(),
            'is-dragged-over-up': this.isDraggedOverUpwards(),
            'is-dragged-over-down': this.isDraggedOverDownwards(),
            'was-dragged-over': this.wasDraggedOver()
        });
        return joinClasses(className, extraClasses);
    }

    private getUpdateCellClass() {
        return this.column.getUpdateCellClass
            ? this.column.getUpdateCellClass(this.selectedColumn, this.column, this.isCellValueChanging)
            : '';
    }

    private isColumnSelected() {
        let meta = this.cellMetaData;
        if (meta == null) { return false; }

        return (
            meta.selected
            && meta.selected.idx === this.idx
        );
    }

    private isSelected() {
        let meta = this.cellMetaData;
        if (meta == null) { return false; }

        return (
            meta.selected
            && meta.selected.rowIdx === this.rowIdx
            && meta.selected.idx === this.idx
        );
    }

    private isActive() {
        let meta = this.cellMetaData;
        if (meta == null) { return false; }
        return this.isSelected() && meta.selected.active === true;
    }

    private isCellSelectionChanging(nextProps: { idx: number; cellMetaData: { selected: { idx: number } } }): boolean {
        let meta = this.cellMetaData;
        if (meta == null) { return false; }
        let nextSelected = nextProps.cellMetaData.selected;
        if (meta.selected && nextSelected) {
            return this.idx === nextSelected.idx || this.idx === meta.selected.idx;
        }

        return true;
    }

    private isCellSelectEnabled() {
        let meta = this.cellMetaData;
        if (meta == null) { return false; }
        return meta.enableCellSelect;
    }

    private hasChangedDependentValues(nextProps: any) {
        let currentColumn = this.column;
        let hasChangedDependentValues = false;

        if (currentColumn.getRowMetaData) {
            let currentRowMetaData = currentColumn.getRowMetaData(this.getRowData(), currentColumn);
            let nextColumn = nextProps.column;
            let nextRowMetaData = nextColumn.getRowMetaData(this.getRowData(nextProps), nextColumn);

            hasChangedDependentValues = !isEqual(currentRowMetaData, nextRowMetaData);
        }

        return hasChangedDependentValues;
    }

    private applyUpdateClass() {

    }

    private setScrollLeft(scrollLeft: number) {
    }

    private isCopied(): boolean {
        let copied = this.cellMetaData.copied;
        return (
            copied
            && copied.rowIdx === this.rowIdx
            && copied.idx === this.idx
        );
    }

    private isDraggedOver(): boolean {
        let dragged = this.cellMetaData.dragged;
        return (
            dragged &&
            dragged.overRowIdx === this.rowIdx
            && dragged.idx === this.idx
        );
    }

    private wasDraggedOver(): boolean {
        let dragged = this.cellMetaData.dragged;
        return (
            dragged
            && ((dragged.overRowIdx < this.rowIdx && this.rowIdx < dragged.rowIdx)
                || (dragged.overRowIdx > this.rowIdx && this.rowIdx > dragged.rowIdx))
            && dragged.idx === this.idx
        );
    }

    private isDraggedCellChanging(nextProps: any): boolean {
        let dragged = this.cellMetaData.dragged;
        let nextDragged = nextProps.cellMetaData.dragged;
        if (dragged) {
            return (nextDragged && this.idx === nextDragged.idx)
                || (dragged && this.idx === dragged.idx);
        }

        return false;
    }

    private isCopyCellChanging(nextProps: any): boolean {
        let copied = this.cellMetaData.copied;
        let nextCopied = nextProps.cellMetaData.copied;
        if (copied) {
            return (nextCopied && this.idx === nextCopied.idx)
                || (copied && this.idx === copied.idx);
        }
        return false;
    }

    private isDraggedOverUpwards(): boolean {
        let dragged = this.cellMetaData.dragged;
        return !this.isSelected() && this.isDraggedOver() && this.rowIdx < dragged.rowIdx;
    }

    private isDraggedOverDownwards(): boolean {
        let dragged = this.cellMetaData.dragged;
        return !this.isSelected() && this.isDraggedOver() && this.rowIdx > dragged.rowIdx;
    }

    private isFocusedOnBody() {
        return document.activeElement == null || (document.activeElement.nodeName && typeof document.activeElement.nodeName === 'string' && document.activeElement.nodeName.toLowerCase() === 'body');
    }

    private checkFocus() {
        if (this.isSelected() && !this.isActive()) {
            if (this.isScrolling && !this.cellMetaData.isScrollingVerticallyWithKeyboard && !this.cellMetaData.isScrollingHorizontallyWithKeyboard) {
                return;
            }
            // Only focus to the current cell if the currently active node in the document is within the data grid.
            // Meaning focus should not be stolen from elements that the grid doesnt control.
            let dataGridDOMNode = this.cellMetaData && this.cellMetaData.getDataGridDOMNode ? this.cellMetaData.getDataGridDOMNode() : null;
            if (document.activeElement.className === 'angular-grid-Cell' || this.isFocusedOnBody() || (dataGridDOMNode && dataGridDOMNode.contains(document.activeElement))) {
                // let cellDOMNode = ReactDOM.findDOMNode(this);
                // if (cellDOMNode) {
                //     cellDOMNode.focus();
                // }
            }
        }
    }

    private canEdit() {
        return (this.column.editor != null) || this.column.editable;
    }

    private canExpand() {
        return this.expandableOptions && this.expandableOptions.canExpand;
    }

    private createColumEventCallBack(onColumnEvent: any, info: any) {
        return (e: any) => {
            onColumnEvent(e, info);
        };
    }

    private createCellEventCallBack(gridEvent: any, columnEvent: any) {
        return (e: any) => {
            gridEvent(e);
            columnEvent(e);
        };
    }

    private createEventDTO(gridEvents: any, columnEvents: any, onColumnEvent: any) {
        let allEvents = Object.assign({}, gridEvents);

        for (let eventKey in columnEvents) {
            if (columnEvents.hasOwnProperty(eventKey)) {
                // let event = columnEvents[event];
                let eventInfo = { rowIdx: this.rowIdx, idx: this.idx, name: eventKey };
                let eventCallback = this.createColumEventCallBack(onColumnEvent, eventInfo);

                if (allEvents.hasOwnProperty(eventKey)) {
                    let currentEvent = allEvents[eventKey];
                    allEvents[eventKey] = this.createCellEventCallBack(currentEvent, eventCallback);
                } else {
                    allEvents[eventKey] = eventCallback;
                }
            }
        }

        return allEvents;
    }

    private getEvents() {
        let columnEvents = this.column ? Object.assign({}, this.column.events) : undefined;
        let onColumnEvent = this.cellMetaData ? this.cellMetaData.onColumnEvent : undefined;
        let gridEvents = {
            onClick: this.onCellClick,
            onDoubleClick: this.onCellDoubleClick,
            onContextMenu: this.onCellContextMenu,
            onDragOver: this.onDragOver
        };

        if (!columnEvents || !onColumnEvent) {
            return gridEvents;
        }

        return this.createEventDTO(gridEvents, columnEvents, onColumnEvent);
    }

    private getKnownDivProps() {
        return createObjectWithProperties(this.props, knownDivPropertyKeys);
    }

}