import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';

/** UB repository introduction; the remaining home-page sections come from the parent theme. */
@Component({
  selector: 'ds-themed-home-news',
  templateUrl: './home-news.component.html',
  styleUrls: ['./home-news.component.scss'],
  imports: [
    TranslateModule,
  ],
})
export class HomeNewsComponent extends BaseComponent {}
