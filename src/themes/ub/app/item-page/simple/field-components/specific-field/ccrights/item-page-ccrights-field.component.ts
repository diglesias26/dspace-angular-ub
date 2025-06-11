//import { Component } from '@angular/core';
import { Component, Input } from '@angular/core';
import {
  ItemPageUriFieldComponent
} from '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-ccrights-field',
  styleUrls: ['./item-page-ccrights-field.component.scss'],
  templateUrl: './item-page-ccrights-field.component.html',
})
export class ItemPageCCrightsFieldComponent extends ItemPageUriFieldComponent {
/*  others = 'https://creativecommons.org/ ...'; */
  others = '';

  /* img preses de https://creativecommons.org/mission/downloads/ */
  images = {
/*
    zero: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/cc-zero.png',
    mark: 'http://mirrors.creativecommons.org/presskit/buttons/88x31/png/publicdomain.png',
    by: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png',
    by_nc: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc.png',
    by_nd: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nd.png',
    by_sa: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-sa.png',
    by_nc_nd: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-nd.png',
    by_nc_sa: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-nc-sa.png',
*/
    // SVG versions of the Creative Commons icons
    zero: 'http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/cc-zero.svg',
    mark: 'http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/publicdomain.svg',
    by: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg',
    by_nc: 'http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc.svg',
    by_nd: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nd.svg',
    by_sa: 'https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-sa.svg',
    by_nc_nd: 'http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-nd.svg',
    by_nc_sa: 'http://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.svg',
};

/**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() rights: string;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() rightsUri: string;

parseUri():string {
    if (this.rightsUri) {
      const uri = this.rightsUri.trim();
      const licencePattern = /creativecommons.*\/licenses\/(by|by-nc|by-nc-sa|by-sa)\//;
      const licencePattern2 = /creativecommons.*\/publicdomain\/(zero|mark)\//;
      const matches = uri.match(licencePattern);
      if (matches) {
        return matches[1];
      } else {
        const matches2 = uri.match(licencePattern2);
        if (matches2) {
          return matches2[1];
        }
      }
    }
    return 'other';
  }

getImageSrc(): string {
    const uri = this.parseUri();
    if (uri && this.images[uri]) {
      return this.images[uri];
    }
    return this.others;
  }


}
