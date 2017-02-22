import {
    Component, OnInit, OnChanges, OnDestroy, AfterViewInit, EventEmitter,
    Input, Output, SimpleChanges, ChangeDetectionStrategy, Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CellNavigationMode, SortDirection, UpdateAction, Style } from '../shared';

type SelectedType = {
    rowIdx: number;
    idx: number;
    active?: any;
    contextMenuDisplayed?: any;
}

type DraggedType = {
    idx: number;
    rowIdx: number;
    value: string;
    overRowIdx?: number;
}

type RowSelectionType = {
    enableShiftSelect?: Function;
    onRowsSelected?: Function;
    onRowsDeselected?: Function;
    showCheckbox?: boolean;
    selectBy?: { indexes: number[] } | { isSelectedKey: string } | { keys: { values: any[], rowKey: string } };
}

type ColumnEvent = {
    name: string;
    rowIdx: number;
    idx: number;
}

type RowUpdateEvent = {
    keyCode: string;
    changed: { expandedHeight: number };
    rowIdx: number;
    key: string;
}

@Component({
    selector: 'angular-data-grid',
    template: './angular-data-grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AngularDataGridComponent implements OnInit {
    @Input() rowHeight: number = 35;
    @Input() headerRowHeight: number;
    @Input() minHeight: number = 350;
    @Input() minWidth: number;
    @Input() enableRowSelect: boolean | string = false;
    @Input() rowGetter: Function;
    @Input() rowsCount: number;
    @Input() toolbar: any;
    @Input() enableCellSelect: boolean = false;
    @Input() columns: Object | Array<any>;
    @Input() rowKey: string = 'id';
    @Input() rowScrollTimeout: number = 0;
    @Input() contextMenu: any;
    @Input() enableDragAndDrop: boolean;
    @Input() draggableHeaderCell: Function;
    @Input() getValidFilterValues: Function;
    @Input() cellNavigationMode: CellNavigationMode = CellNavigationMode.None;
    @Input() rowSelection: RowSelectionType;
    @Input() rowGroupRenderer: Function;
    @Input() rowActionsCell: Function;
    @Input() overScan: Object = {
        colsStart: 5,
        colsEnd: 5,
        rowsStart: 5,
        rowsEnd: 5
    };


    @Output() clearFilters: EventEmitter<any> = new EventEmitter();
    @Output() rowUpdated: EventEmitter<any> = new EventEmitter();
    @Output() rowClick: EventEmitter<any> = new EventEmitter();
    @Output() filter: EventEmitter<any> = new EventEmitter();
    @Output() cellCopyPaste: EventEmitter<any> = new EventEmitter();
    @Output() cellsDragged: EventEmitter<any> = new EventEmitter();
    @Output() addFilter: EventEmitter<any> = new EventEmitter();
    @Output() gridSort: EventEmitter<any> = new EventEmitter();
    @Output() dragHandleDoubleClick: EventEmitter<any> = new EventEmitter();
    @Output() gridRowsUpdated: EventEmitter<any> = new EventEmitter();
    @Output() gridKeyUp: EventEmitter<any> = new EventEmitter();
    @Output() gridKeyDown: EventEmitter<any> = new EventEmitter();
    @Output() checkCellIsEditable: EventEmitter<any> = new EventEmitter();
    @Output() rowSelect: EventEmitter<any> = new EventEmitter();
    @Output() cellSelected: EventEmitter<any> = new EventEmitter();
    @Output() cellDeSelected: EventEmitter<any> = new EventEmitter();
    @Output() cellExpand: EventEmitter<any> = new EventEmitter();
    @Output() rowExpandToggle: EventEmitter<any> = new EventEmitter();

    private selected: SelectedType;
    private columnMetrics: any;
    private selectedRows: any[];
    private copied: { idx: number; rowIdx: number };
    private expandedRows: any[];
    private canFilter: boolean;
    private columnFilters: any;
    private sortDirection: SortDirection;
    private sortColumn: any;
    private dragged: DraggedType;
    private textToCopy: any;
    private scrollOffset: number;

    constructor() { }

    ngOnInit(): void {
        if (this.enableCellSelect) {
            this.selected = { rowIdx: 0, idx: 0 };
        } else {
            this.selected = { rowIdx: -1, idx: -1 };
        }
    }

    hasSelectedCellChanged(selected: SelectedType): boolean {
        let previouslySelected: SelectedType = Object.assign({}, this.selected);
        return previouslySelected.rowIdx !== selected.rowIdx || previouslySelected.idx !== selected.idx || previouslySelected.active === false;
    }

    onContextMenuHide(): void {
        document.removeEventListener('click', this.onContextMenuHide);
        this.selected = Object.assign({}, this.selected, { contextMenuDisplayed: false });
    }

    onColumnEvent(ev: Event, columnEvent: ColumnEvent): void {
        let {idx, name} = columnEvent;

        if (name && typeof idx !== 'undefined') {
            // let column = this.getColumn(idx);
            let column: any = null;

            if (column && column.events && column.events[name] && typeof column.events[name] === 'function') {
                let eventArgs = {
                    rowIdx: columnEvent.rowIdx,
                    idx,
                    column
                };

                column.events[name](ev, eventArgs);
            }
        }
    }

    onSelect(selected: SelectedType): void {

    }

    onCellClick(cell: SelectedType): void {
        this.onSelect({ rowIdx: cell.rowIdx, idx: cell.idx });
        this.rowClick.emit({ rowIdx: cell.rowIdx, row: this.rowGetter(cell.rowIdx) });
    }

    onCellContextMenu(cell: SelectedType): void {
        this.onSelect({ rowIdx: cell.rowIdx, idx: cell.idx, contextMenuDisplayed: this.contextMenu });
        if (this.contextMenu) {
            document.addEventListener('click', this.onContextMenuHide);
        }
    }

    onCellDoubleClick(cell: SelectedType): void {
        this.onSelect({ rowIdx: cell.rowIdx, idx: cell.idx });
        this.setActive('Enter');
    }

    onViewportDoubleClick(): void {
        this.setActive();
    }

    onPressArrowUp(e: KeyboardEvent): void {
        this.moveSelectedCell(e, -1, 0);
    }

    onPressArrowDown(e: KeyboardEvent): void {
        this.moveSelectedCell(e, 1, 0);
    }

    onPressArrowLeft(e: KeyboardEvent): void {
        this.moveSelectedCell(e, 0, -1);
    }

    onPressArrowRight(e: KeyboardEvent): void {
        this.moveSelectedCell(e, 0, 1);
    }

    onPressTab(e: KeyboardEvent): void {
        this.moveSelectedCell(e, 0, e.shiftKey ? -1 : 1);
    }

    onPressEnter(e: KeyboardEvent): void {
        this.setActive(e.key);
    }

    private onPressDelete(e: KeyboardEvent): void {
        this.setActive(e.key);
    }

    onPressEscape(e: KeyboardEvent): void {
        this.setInactive(e.key);
        this.handleCancelCopy();
    }

    onPressBackspace(e: KeyboardEvent): void {
        this.setActive(e.key);
    }

    onPressChar(e: KeyboardEvent): void {
        if (this.isKeyPrintable(e.keyCode)) {
            this.setActive(e.keyCode);
        }
    }

    onPressKeyWithCtrl(e: KeyboardEvent): void {
        let keys = {
            KeyCode_c: 99,
            KeyCode_C: 67,
            KeyCode_V: 86,
            KeyCode_v: 118
        };

        let rowIdx = this.selected.rowIdx;
        let row = this.rowGetter(rowIdx);

        let idx = this.selected.idx;
        let col = this.getColumn(idx);

        if (ColumnUtils.canEdit(col, row, this.enableCellSelect)) {
            if (e.keyCode === keys.KeyCode_c || e.keyCode === keys.KeyCode_C) {
                let value = this.getSelectedValue();
                this.handleCopy({ value: value });
            } else if (e.keyCode === keys.KeyCode_v || e.keyCode === keys.KeyCode_V) {
                this.handlePaste();
            }
        }
    }

    onGridRowsUpdated(cellKey: any, fromRow: any, toRow: any, updated: any, action: any): void {
        let rowIds = [];

        for (let i = fromRow; i <= toRow; i++) {
            rowIds.push(this.rowGetter(i)[this.rowKey]);
        }

        this.gridRowsUpdated.emit({ cellKey, fromRow, toRow, rowIds, updated, action });
    }

    onCellCommit(commit: RowUpdateEvent): void {
        let selected = Object.assign({}, this.selected);
        selected.active = false;
        if (commit.key === 'Tab') {
            selected.idx += 1;
        }
        // let expandedRows = this.expandedRows;
        // if(commit.changed && commit.changed.expandedHeight){
        //   expandedRows = this.expandRow(commit.rowIdx, commit.changed.expandedHeight);
        // }
        // this.setState({ selected: selected, expandedRows: expandedRows });
        this.selected = selected;
        // this.expandedRows  = expandedRows

        this.rowUpdated.emit(commit);
        let targetRow = commit.rowIdx;

        // this.onGridRowsUpdated.emit({ cellKey: commit.cellKey, row: targetRow, op: commit.updated, AppConstants.UpdateActions.CELL_UPDATE);
    }

    onDragStart(e: DragEvent): void {
        // let idx = this.state.selected.idx;
        // // To prevent dragging down/up when reordering rows.
        // const isViewportDragging = e && e.target && e.target.className;
        // if (idx > -1 && isViewportDragging) {
        //     let value = this.getSelectedValue();
        //     this.handleDragStart({ idx: this.state.selected.idx, rowIdx: this.state.selected.rowIdx, value: value });
        //     // need to set dummy data for FF
        //     if (e && e.dataTransfer) {
        //         if (e.dataTransfer.setData) {
        //             e.dataTransfer.dropEffect = 'move';
        //             e.dataTransfer.effectAllowed = 'move';
        //             e.dataTransfer.setData('text/plain', '');
        //         }
        //     }
        // }
    }

    onToggleFilter() {
        this.canFilter = !this.canFilter;
        if (this.canFilter === false) {
            this.clearFilters.emit();
        }
    }

    onDragHandleDoubleClick(e: any): void {
        this.dragHandleDoubleClick.emit(e);

        const args = {
            cellKey: this.getColumn(e.idx).key,
            rowIdx: e.rowIdx,
            rowsCount: this.rowsCount - 1,
            a: { [cellKey]: e.rowData[cellKey] },
            updateAction: UpdateAction.ColumnFill
        }
        this.gridRowsUpdated.emit(args);
    }


    onCellExpand(args: any): void {
        this.cellExpand.emit(args);
    }

    onRowExpandToggle(args: any): void {
        this.rowExpandToggle.emit(args);
    }

    isCellWithinBounds({idx, rowIdx}: { idx: number, rowIdx: number }): void {
        return idx >= 0
            && rowIdx >= 0
            && idx < ColumnUtils.getSize(this.columnMetrics.columns)
            && rowIdx < this.rowsCount;
    }

    handleDragStart(dragged: DraggedType): void {
        if (!this.dragEnabled()) { return; }
        if (this.isCellWithinBounds(dragged)) {
            this.dragged = dragged;
        }
    }

    handleDragEnd(): void {
    }

    handleDragEnter(row: any): void {
        if (!this.dragEnabled() || this.dragged == null) { return; }
        this.dragged.overRowIdx = row;
    }

    handleTerminateDrag(): void {
        if (!this.dragEnabled()) { return; }
        this.dragged = null;
    }

    handlePaste(): void {

    }

    handleCancelCopy(): void {
        this.copied = null;
    }

    handleCopy(args: { value: string }): void {
        if (!this.copyPasteEnabled()) { return; }
        this.textToCopy = args.value;
        this.copied = { idx: this.selected.idx, rowIdx: this.selected.rowIdx };
    }

    handleSort(columnKey: string, direction: SortDirection): void {
        this.sortDirection = direction;
        this.sortColumn = columnKey;
        this.gridSort.emit({ columnKey, direction });
    }

    getSelectedRow(rows: any[], key: string): any {
        let selectedRow = rows.filter(r => {
            if (r[this.rowKey] === key) {
                return true;
            }
            return false;
        });
        if (selectedRow.length > 0) {
            return selectedRow[0];
        }
    }

    useNewRowSelection(): any {
        return this.rowSelection && this.rowSelection.selectBy;
    }

    handleShiftSelect(): void {

    }

    handleNewRowSelect(): void {

    }

    handleRowSelect(): void {

    }

    handleCheckboxChange(): void {

    }

    getScrollOffSet(): void {

    }

    getRowOffsetHeight(): void {

    }

    getHeaderRows(): void {

    }

    getInitialSelectedRows(): void {

    }

    getRowSelectionProps(): void {

    }

    getSelectedRows(): void {

    }

    getSelectedValue(): void {

    }

    moveSelectedCell(): void {

    }

    getNbrColumns(): void {

    }

    getDataGridDOMNode(): void {

    }

    calculateNextSelectionPosition(): void {

    }

    isAtLastCellInRow(): void {

    }

    isAtLastRow(): void {

    }

    isAtFirstCellInRow(): void {

    }

    isAtFirstRow(): void {

    }

    openCellEditor(): void {

    }

    scrollToColumn(): void {

    }

    setActive(): void {

    }

    setInactive(): void {

    }

    isActive(): void {

    }

    setupGridColumns(): void {

    }

    copyPasteEnabled(): boolean {
        return false;
    }

    dragEnabled(): boolean {
        return false;
    }

    getStyle(): Style {
        let style: Style = {};
        let containerWidth = this.minWidth || this.DOMMetrics.gridWidth();

        if (typeof containerWidth === 'undefined' || isNaN(containerWidth) || containerWidth === 0) {
            style['width.%'] = 100;
        }

        style['width.px'] = containerWidth;

        return style;
    }
}