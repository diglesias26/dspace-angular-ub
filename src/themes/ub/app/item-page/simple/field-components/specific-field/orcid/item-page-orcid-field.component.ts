//import { Component } from '@angular/core';
import { Component, Input } from '@angular/core';
import {
  ItemPageUriFieldComponent
} from '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-orcid-field',
  styleUrls: ['./item-page-orcid-field.component.scss'],
  templateUrl: './item-page-orcid-field.component.html',
})
export class ItemPageOrcidFieldComponent extends ItemPageUriFieldComponent {
  prefix = 'https://orcid.org/';
  img_src = 'https://orcid.org/assets/vectors/orcid.logo.icon.svg';

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() author: string;
}
