//import { Component } from '@angular/core';
import { Component, Input } from '@angular/core';
import {
  ItemPageUriFieldComponent
} from '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-version-field',
  styleUrls: ['./item-page-version-field.component.scss'],
  templateUrl: './item-page-version-field.component.html',
})

export class ItemPageVersionFieldComponent extends ItemPageUriFieldComponent {

  prefix = 'item.page.version.';
  versions = [
    'publishedversion',
    'acceptedversion',
    'submittedversion',
    'draftversion',
    'otherversion',
  ];

  getVersion() {
    for (const type of this.item.allMetadata('dc.type')) {
      let parts = type.value.split('/');
      let last = parts[parts.length - 1];
      last = last.toLowerCase();
      if (this.versions.includes(last)) {
        return this.prefix + last;
      }
    }
    return '';
    return this.prefix + 'otherversion';
  }

}
