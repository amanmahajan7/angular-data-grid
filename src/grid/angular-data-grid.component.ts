import {
    Component, OnInit, OnChanges, OnDestroy, AfterViewInit, EventEmitter,
    Input, Output, SimpleChanges, ChangeDetectionStrategy, Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { isEqual } from 'lodash';
import * as joinClasses from 'classnames';

type SelectedType = {
    rowIdx: number;
    idx: number;
};

type ColumnEvent = {
    name: string,
    rowIdx: number;
    idx: number;
}

type DraggedType = {
    idx: number;
    rowIdx: number;
    value: string;
};

type RowUpdateEvent = {
    keyCode: string;
    changed: { expandedHeight: number };
    rowIdx: number;
};

@Component({
    selector: 'cell',
    template: './cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AngularDataGridComponent {
    @Input() rowHeight: number;
    @Input() headerRowHeight?: number;
    @Input() minHeight: number;
    @Input() minWidth?: number;
    @Input() enableRowSelect?: boolean | string;
    @Input() onRowUpdated?: Function;
    @Input() rowGetter: Function;
    @Input() rowsCount: number;
    @Input() toolbar: any;
    @Input() enableCellSelect?: boolean;
    @Input() columns: Object | Array<any>;
    @Input() onFilter?: Function;
    @Input() onCellCopyPaste?: Function;
    @Input() onCellsDragged?: Function;
    @Input() onAddFilter?: Function;
    @Input() onGridSort?: Function;
    @Input() onDragHandleDoubleClick?: Function;
    @Input() onGridRowsUpdated?: Function;
    @Input() onRowSelect?: Function;
    @Input() rowKey?: string;
    @Input() rowScrollTimeout?: number;
    @Input() onClearFilters?: Function;
    @Input() contextMenu?: any;
    // @Input() cellNavigationMode: React.PropTypes.oneOf(['none', 'loopOverRow', 'changeRow']),
    @Input() onCellSelected?: Function;
    @Input() onCellDeSelected?: Function;
    @Input() onCellExpand?: Function;
    @Input() enableDragAndDrop?: boolean;
    @Input() onRowExpandToggle?: Function;
    @Input() draggableHeaderCell?: Function;
    @Input() getValidFilterValues?: Function;
    // @Input() rowSelection: React.PropTypes.shape({
    //     enableShiftSelect: React.PropTypes.bool,
    //     onRowsSelected: React.PropTypes.func,
    //     onRowsDeselected: React.PropTypes.func,
    //     showCheckbox: React.PropTypes.bool,
    //     selectBy: React.PropTypes.oneOfType([
    //         React.PropTypes.shape({
    //             indexes: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
    //         }),
    //         React.PropTypes.shape({
    //             isSelectedKey: React.PropTypes.string.isRequired
    //         }),
    //         React.PropTypes.shape({
    //             keys: React.PropTypes.shape({
    //                 values: React.PropTypes.array.isRequired,
    //                 rowKey: React.PropTypes.string.isRequired
    //             }).isRequired
    //         })
    //     ]).isRequired
    // }),
    @Input() onGridKeyUp?: Function;
    @Input() onGridKeyDown?: Function;
    @Input() rowGroupRenderer?: Function;
    @Input() rowActionsCell?: Function;
    @Input() onCheckCellIsEditable?: Function;
    /* called before cell is set active, returns a boolean to determine whether cell is editable */
    @Input() overScan?: Object;


    @Output() onRowClick: EventEmitter<any> = new EventEmitter();

    constructor() { }

    private onSelect(selected: SelectedType) {
        // if (this.selected.rowIdx !== selected.rowIdx
        //   || this.selected.idx !== selected.idx
        //   || this.selected.active === false) {
        //   let idx = selected.idx;
        //   let rowIdx = selected.rowIdx;
        //   if (
        //       idx >= 0
        //       && rowIdx >= 0
        //       && idx < ColumnUtils.getSize(this.columnMetrics.columns)
        //       && rowIdx < this.props.rowsCount
        //     ) {
        //     const oldSelection = this.state.selected;
        //     this.setState({selected: selected}, () => {
        //       if (typeof this.props.onCellDeSelected === 'function') {
        //         this.props.onCellDeSelected(oldSelection);
        //       }
        //       if (typeof this.props.onCellSelected === 'function') {
        //         this.props.onCellSelected(selected);
        //       }
        //     });
        //   }
        // }
    }

    private onCellClick(cell: SelectedType): void {
        this.onSelect({ rowIdx: cell.rowIdx, idx: cell.idx });
        this.onRowClick.emit({ rowIdx: cell.rowIdx });

        // if (this.props.onRowClick && typeof this.props.onRowClick === 'function') {
        //     this.props.onRowClick(cell.rowIdx, this.props.rowGetter(cell.rowIdx));
        // }
    }
}