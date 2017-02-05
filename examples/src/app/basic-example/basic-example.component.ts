import { Component, OnInit } from '@angular/core';

import { Column } from '../../../../src/shared';

@Component({
  selector: 'app-basic-example',
  templateUrl: './basic-example.component.html',
  styleUrls: ['./basic-example.component.css']
})
export class BasicExampleComponent implements OnInit {
  columns: Column[] = [];

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      this.columns.push({
        name: 'name ' + i,
        key: 'key ' + i,
        width: 100,
        left: 120 * i,
        resizable: true,
        sortable: true
      });
    }
  }
}
