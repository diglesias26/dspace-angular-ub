//import { Component } from '@angular/core';
import { Component, Input } from '@angular/core';
import {
  ItemPageUriFieldComponent
} from '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-embargo-field',
  styleUrls: ['./item-page-embargo-field.component.scss'],
  templateUrl: './item-page-embargo-field.component.html',
})

export class ItemPageEmbargoFieldComponent extends ItemPageUriFieldComponent {
  getDateEmbargoLift() {
    for (const dia of this.item.allMetadata('dc.embargo.lift')) {
      return dia.value;
    }
    return '';
  }

}
