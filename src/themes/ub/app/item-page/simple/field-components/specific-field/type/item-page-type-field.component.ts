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
    let type = this.item?.firstMetadataValue('dc.type');
    // if no type, return an empty string
    if (!type) {
      return this.prefix + 'other';
    }
    let parts = type.split('/');
    type = parts[parts.length - 1];
    type = type.toLowerCase();
    if (!this.types.includes(type)) {
      type = 'other';
    }

    return this.prefix + type;
  }

}
