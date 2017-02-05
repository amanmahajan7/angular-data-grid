export interface Column {
    name: any;
    key: string;
    width: number;
    sortable?: boolean;
    resizable?: boolean;
    filterable?: boolean;

    // width: number;
    left: number;
    locked?: boolean;
    editor?: any;
    editable?: boolean;
    cellClass?: string;
    events?: string[];
    getRowMetaData?: Function;
    getUpdateCellClass?: Function;
}