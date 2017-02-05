import { FilterableHeaderCellComponent } from './header-cell/filterable-header-cell.component';
import { SortableHeaderCellComponent } from './header-cell/sortable-header-cell.component';
import { HeaderCellComponent } from './header-cell/header-cell.component';
import { ResizeHandleComponent } from './header-cell/resize-handle.component';
import { SimpleRenderer } from './header-cell/simple-renderer.component';
import { HeaderRowComponent } from './header-row.component';

export const headerComponents: Function[] = [
    FilterableHeaderCellComponent,
    SortableHeaderCellComponent,
    HeaderCellComponent,
    ResizeHandleComponent,
    SimpleRenderer,
    HeaderRowComponent
];