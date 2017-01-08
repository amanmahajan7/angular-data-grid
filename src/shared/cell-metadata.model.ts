export interface CellMetadata {
    selected: Object;
    copied?: { rowIdx?: number, idx: number };
    dragged?: { rowIdx?: number, overRowIdx?: number, idx: number };
    isScrollingVerticallyWithKeyboard?: boolean;
    isScrollingHorizontallyWithKeyboard?: boolean;
    onCellClick: Function;
    onCellDoubleClick: Function;
    onCommit: Function;
    onCommitCancel: Function;
    handleDragEnterRow: Function;
    handleTerminateDrag: Function;
}