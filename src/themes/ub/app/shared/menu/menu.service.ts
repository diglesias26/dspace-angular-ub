import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../app/app.reducer';
import { MenuService as BaseMenuService } from '../../../../../app/shared/menu/menu.service';
import { MenuID } from '../../../../../app/shared/menu/menu-id.model';
import { MenuSection } from '../../../../../app/shared/menu/menu-section.model';

@Injectable()
export class MenuService extends BaseMenuService {

  constructor(
    protected store: Store<AppState>,
    protected route: ActivatedRoute,
  ) {
    super(store, route as any, null as any);
  }

  // Filter route-defined sections before they are added/removed
  override resolveRouteMenuSections(route: ActivatedRoute, menuID: MenuID): MenuSection[] {
    const sections = super.resolveRouteMenuSections(route, menuID) || [];
    if (menuID === MenuID.PUBLIC) {
      return sections.filter((s) => !s.id?.startsWith('statistics_'));
    }
    return sections;
  }
}