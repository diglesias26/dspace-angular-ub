import { Component } from '@angular/core';
import { TypeBadgeComponent as BaseComponent } from 'src/app/shared/object-collection/shared/badges/type-badge/type-badge.component';

@Component({
  selector: 'ds-type-badge',
  styleUrls: ['./type-badge.component.scss'],
  templateUrl: './type-badge.component.html',
  // templateUrl: '../../../../../../../../app/shared/object-collection/shared/badges/type-badge/type-badge.component.html',
})
export class TypeBadgeComponent extends BaseComponent {
  // Custom logic for the ds-type-badge component can go here

  prefix = 'item.page.type.';
  types = [
    'article',
    'bachelorthesis',
    'masterthesis',
    'doctoralthesis',
    'book',
    'bookpart',
    'review',
    'conferenceobject',
    'lecture',
    'workingpaper',
    'preprint',
    'report',
    'annotation',
    'contributiontoperiodical',
    'patent',
    'other',
  ];

  getAccessibleLabel() {
    let access = this.object?.firstMetadataValue('dc.rights.accessRights');

    if (!access) {
      return false;
    }
    let parts = access.split('/');
    access = parts[parts.length - 1];
    access = access.toLowerCase();
    if (access == 'openaccess') {
      return true;
    }
    return false;

  }

  getType() {
    for (const type of this.object.allMetadata('dc.type')) {
      let parts = type.value.split('/');
      let last = parts[parts.length - 1];
      last = last.toLowerCase();
      if (this.types.includes(last)) {
        return this.prefix + last;
      }
    }
    return this.prefix + 'other';
  }

}
