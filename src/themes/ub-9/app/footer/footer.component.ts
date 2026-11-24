import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';

/** UB branding with cookie, authorization and information-page behavior inherited from DSpace 9.4. */
@Component({
  selector: 'ds-themed-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class FooterComponent extends BaseComponent {}
