//import { Component } from '@angular/core';
import { Component, Input } from '@angular/core';
import {
  ItemPageUriFieldComponent
} from '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-type-field',
  styleUrls: ['./item-page-type-field.component.scss'],
  templateUrl: './item-page-type-field.component.html',
})

export class ItemPageTypeFieldComponent extends ItemPageUriFieldComponent {

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

  getType() {
    for (const type of this.item.allMetadata('dc.type')) {
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
