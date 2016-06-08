import "reflect-metadata";
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import {
  DataTable,
  TableOptions,
  TableColumn,
  SelectionType,
  ColumnMode
//} from '../release/angular2-data-table.js';
} from './main';

@Component({
  selector: 'app',
  template: `
    <div>
    	<h3>Basic</h3>
    	<datatable
        class="material"
    		[rows]="rows"
    		[options]="options"
        [selected]="selected"
        (onPageChange)="onPage($event)">
    	</datatable>
    </div>
  `,
  directives: [ DataTable ]
})
class AppComponent {

  selected = [];
	rows = [
    {
      "name": "Claudine Neal",
      "gender": "female",
      "company": "Sealoud"
    },
    {
      "name": "Beryl Rice",
      "gender": "female",
      "company": "Velity"
    }
  ];

	options = new TableOptions({
    columnMode: ColumnMode.force,
    headerHeight: 50,
    footerHeight: 50,
    rowHeight: 'auto',
    limit: 10,
    selectionType: SelectionType.multiShift,
    columns: [
      new TableColumn({ name: "Name" }),
      new TableColumn({ name: "Gender" }),
      new TableColumn({ name: "Company", comparator: this.sorter.bind(this) })
    ]
  });

  constructor() {
    // this.page();
  }

  page() {
    this.fetch((results) => {
      this.options.count = results.length;
      let start = this.options.offset * this.options.limit;
      let end = start + this.options.limit;

      let paged = results.slice(start, end);

      // splice doesn't let u insert at
      // a new out of bounds index :(
      // this.rows.splice(0, this.rows.length);
      // this.rows.push(...paged)
      // this.rows.splice(start, 0, ...paged);

      for (let i = start; i < end; i++) {
        this.rows[i] = results[i];
      }

      console.log('updated', start, end, this.rows)
    });
  }

  fetch(cb) {
    var req = new XMLHttpRequest();
    req.open('GET', `demos/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  sorter(rows, dirs) {
    setTimeout(() => {
      this.fetch((results) => {
        this.rows = results;
      });
    }, 500);
  }

  onPage({ offset, limit, count }) {
    console.log('Paged!', offset, limit, count);
    this.page();
  }

}

bootstrap(AppComponent, []);