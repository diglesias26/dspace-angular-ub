//import { Component } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Item } from '../../../../../../../../app/core/shared/item.model';

import {
  ItemPageUriFieldComponent
} from '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-item-page-share-field',
  styleUrls: ['./item-page-share-field.component.scss'],
  templateUrl: './item-page-share-field.component.html',
})

export class ItemPageShareFieldComponent extends ItemPageUriFieldComponent {

  // todo: get the handle prefix from the configuration
handlePrefix = 'hdl.handle.net/' + '123456789';
  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */  

  @Input() label: string;

/** dc.title **/
getTitle(): string { 
  return this.item.firstMetadataValue('dc.title');
}
/** dc.identifier.uri - handle  */
getHandle(): string {
  // filter the handle to have the required format
  const handle = this.item.firstMetadataValue('dc.identifier.uri');
  if (handle) {
    // check if hdl.handle.net/prefix is present
    const prefix = this.handlePrefix;
    if (handle.startsWith(prefix)) {
      return handle;
    }
    else {
      // check more metadata values for the handle and return the first one that starts with the prefix
      const handles = this.item.allMetadataValues('dc.identifier.uri');
      if (handles) {
        return handles.find(h => h.startsWith(prefix)) || '';
      }
    }
  }
  // if no handle is found, return an empty string
  return '';
}

/** dc.description.abstract */
getAbstract(): string {
  return this.item.firstMetadataValue('dc.description.abstract');
}

/** gen url for mendeley */
getMendeleyUrl(): string {
  return 'http://www.mendeley.com/import/?url=' + this.getHandle();
}

/** gen print url */
getPrintScript(): string {
  return 'window.print();return false;';
}

/** event on click for print */
onPrintClick(): boolean {
  window.print();
  // return false to prevent the default behavior of the link
  return false;
}

/** event on click for x */
onXClick(): boolean {
  window.open('https://x.com/share?text=' + this.getTitle() + ' ' + this.getHandle(), '_blank');
  // return false to prevent the default behavior of the link
  return false;
}

/** event on click for bluesky */
onBlueskyClick(): boolean {
  window.open('https://bsky.app/profile/bsky.social/' + this.getHandle(), '_blank');
  // return false to prevent the default behavior of the link
  return false;
}

/** event on click for linkedin */
onLinkedinClick(): boolean {
  window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + this.getHandle(), '_blank');
  // return false to prevent the default behavior of the link
  return false;
}

/** event on click for facebook */
onFacebookClick(): boolean {
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + this.getHandle(), '_blank');
  // return false to prevent the default behavior of the link
  return false;
}

/** event on click for telegram */
onTelegramClick(): boolean {
  window.open('https://telegram.me/share/url?url=' + this.getHandle(), '_blank');
  // return false to prevent the default behavior of the link
  return false;
}

/** event on click for whatsapp */
onWhatsappClick(): boolean {
  window.open('https://wa.me/?text=' + this.getTitle() + ' ' + this.getHandle(), '_blank');
  // return false to prevent the default behavior of the link
  return false;
}

}
