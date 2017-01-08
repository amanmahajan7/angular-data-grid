export interface Column {
    width: number;
    left: number;
    locked?: boolean;
    editor?: any;
    editable?: boolean;
    cellClass?: string;
    events?: string[];
    getRowMetaData?: Function;
    getUpdateCellClass?: Function;
}