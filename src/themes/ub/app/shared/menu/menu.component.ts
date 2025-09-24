/** oriol - override menu component to hide statistics links from the PUBLIC menu */
import { Component } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuID } from '../../../../../app/shared/menu/menu-id.model';
import {
  MenuComponent as BaseComponent
} from '../../../../../app/shared/menu/menu.component';

@Component({
  selector: 'ds-menu',
  template: '',
})
export class MenuComponent extends BaseComponent {

  // Override ngOnInit to filter out statistics sections before processing
  override ngOnInit(): void {
    super.ngOnInit();
    

  // Add a simple visual indicator that our theme component is active
  console.log('[THEME MENU] Component loaded for menuID:', this.menuID);
  

    // Override the sections observable to filter out statistics for PUBLIC menu
    if (this.menuID === MenuID.PUBLIC) {
      this.sections = this.sections.pipe(
        map((sections: any[]) => {
          //return sections.filter(section => !section.id.startsWith('statistics_'));
          console.log('[THEME MENU] Filtering sections:', sections.map(s => s.id));
          const filtered = sections.filter(section => !section.id.startsWith('statistics_'));
          console.log('[THEME MENU] After filtering:', filtered.map(s => s.id));
          return filtered;
        })
      );
    }
  }
}