//import { Component } from '@angular/core';
import { Component, Input } from '@angular/core';
import {
  ItemPageUriFieldComponent
} from '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-export-field',
  styleUrls: ['./item-page-export-field.component.scss'],
  templateUrl: './item-page-export-field.component.html',
})

export class ItemPageExportFieldComponent extends ItemPageUriFieldComponent {

}
