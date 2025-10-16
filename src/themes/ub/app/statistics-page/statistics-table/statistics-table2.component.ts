import { Component, Input, OnInit } from '@angular/core';
import { Point, UsageReport } from '../../../../../app/core/statistics/models/usage-report.model';
import { Observable, of } from 'rxjs';
import { DSONameService } from '../../../../../app/core/breadcrumbs/dso-name.service';
import { map } from 'rxjs/operators';
import { getRemoteDataPayload, getFinishedRemoteData } from '../../../../../app/core/shared/operators';
import { DSpaceObjectDataService } from '../../../../../app/core/data/dspace-object-data.service';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty } from '../../../../../app/shared/empty.util';

/**
 * Component representing a statistics table for a given usage report.
 */
@Component({
  selector: 'ds-statistics-table2',
  templateUrl: './statistics-table2.component.html',
  styleUrls: ['./statistics-table2.component.scss']
})
export class StatisticsTable2Component implements OnInit {

  /**
   * The usage report to display a statistics table for
   */
  @Input()
  report: UsageReport;

  /**
   * Boolean indicating whether the usage report has data
   */
  hasData: boolean;

  /**
   * The table headers
   */
  headers: string[];

  constructor(
    protected dsoService: DSpaceObjectDataService,
    protected nameService: DSONameService,
    private translateService: TranslateService,
  ) {

  }

  ngOnInit() {
    this.hasData = this.report.points.length > 0;
    if (this.hasData) {
      this.headers = Object.keys(this.report.points[0].values);
    }
  }

  /** 
   * translate the label of the report
   */
  translateLabel(label: string): string {
    // check is label is a month name
    if (label.match(/^January|February|March|April|May|June|July|August|September|October|November|December$/)) {
      // split label to separate the year and the month
      const parts = label.split(' ');
      const year = parts[1];
      const month = parts[0];
      return this.translateService.instant('browse.startsWith.months.' + month.toLowerCase()) + ' ' + year;
    }
    if (label.match(/^views$/)) {
      return this.translateService.instant('statistics.table.header.views');
    }
    if (label.match(/^downloads$/)) {
      return this.translateService.instant('statistics.table.header.downloads');
    }

    return label;
  }

  /**
   * Get the row label to display for a statistics point.
   * @param point the statistics point to get the label for
   */
  getLabel(point: Point): Observable<string> {
    switch (this.report.reportType) {
      case 'TotalVisits':
        return this.dsoService.findById(point.id).pipe(
          getFinishedRemoteData(),
          getRemoteDataPayload(),
          map((item) => !isEmpty(item) ?  this.nameService.getName(item) : this.translateService.instant('statistics.table.no-name')),
        );
      case 'TopCities':
      case 'topCountries':
      default:
        return of(point.label);
    }
  }
}
