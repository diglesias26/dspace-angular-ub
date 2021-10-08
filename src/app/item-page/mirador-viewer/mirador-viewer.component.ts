import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Item } from '../../core/shared/item.model';
import { environment } from '../../../environments/environment';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload
} from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Bitstream } from '../../core/shared/bitstream.model';
import { Observable } from 'rxjs/internal/Observable';
import { filter, last, map, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

@Component({
  selector: 'ds-mirador-viewer',
  styleUrls: ['./mirador-viewer.component.scss'],
  templateUrl: './mirador-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiradorViewerComponent implements OnInit {

  @Input() item: Item;

  @Input() query: string;

  @Input() searchable: boolean;

  iframeViewerUrl: Observable<SafeResourceUrl>;

  multi = false;

  notMobile = false;

  LINKS_TO_FOLLOW: FollowLinkConfig<Bitstream>[] = [
    followLink('format'),
  ];

  constructor(private sanitizer: DomSanitizer,
              private bitstreamDataService: BitstreamDataService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  /**
   * Creates the url for the Mirador iframe. Adds parameters for the displaying the search panel, query results,
   * or  multi-page thumbnail navigation.
   */
  setURL() {
    // The path to the REST manifest endpoint.
    const manifestApiEndpoint = encodeURIComponent(environment.rest.baseUrl + '/iiif/'
      + this.item.id + '/manifest');
    // The Express path to Mirador viewer.
    let viewerPath = '/iiif/mirador/index.html?manifest=' + manifestApiEndpoint;
    if (this.searchable) {
      // Tell the viewer add search to menu.
      viewerPath += '&searchable=' + this.searchable;
    }
    if (this.query) {
      // Tell the viewer to execute a search for the query term.
      viewerPath += '&query=' + this.query;
    }
    if (this.multi) {
      // Tell the viewer to add thumbnail navigation. If searchable, thumbnail navigation is added by default.
      viewerPath += '&multi=' + this.multi;
    }
    if (this.notMobile) {
      viewerPath += '&notMobile=true';
    }
    // TODO: review whether the item.id should be sanitized. The query term probably should be.
    return this.sanitizer.bypassSecurityTrustResourceUrl(viewerPath);
  }

  ngOnInit(): void {
    /**
     * Initializes the iframe url observable.
     */
    if (isPlatformBrowser(this.platformId)) {
      // This will not be responsive to resizing.
      if (window.innerWidth > 768) {
        this.notMobile = true;
      }

      // We need to set the multi property to true if the
      // item is searchable or the ORIGINAL bundle contains more
      // than 1 image bitstream. The multi property controls the
      // Mirador side navigation panel.
      if (this.searchable) {
        // If it's searchable set multi to true.
        const observable = of({multi: true});
        this.iframeViewerUrl = observable.pipe(
          map((val) => {
            this.multi = val.multi;
            return this.setURL();
          })
        );
      } else {
        // Gets the first 10 items in the bundle and counts the number of images. Emits the final count.
        let count = 0;
        const imageCount$ = this.bitstreamDataService.findAllByItemAndBundleName(this.item, 'ORIGINAL', {
          currentPage: 1,
          elementsPerPage: 10
        }, true, true, ...this.LINKS_TO_FOLLOW)
          .pipe(
            getFirstCompletedRemoteData(),
            map((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => bitstreamsRD.payload),
            map((paginatedList: PaginatedList<Bitstream>) => paginatedList.page),
            switchMap((bitstreams: Bitstream[]) => bitstreams),
            switchMap((bitstream: Bitstream) => bitstream.format.pipe(
              getFirstSucceededRemoteDataPayload(),
              map((format: BitstreamFormat) => format)
            )),
            map((format: BitstreamFormat) => {
              if (format.mimetype.includes('image')) {
                count++;
              }
              return count;
             }),
            last()
          );

        // Sets the multi value based on the image count and then sets the iframe url.
        this.iframeViewerUrl = imageCount$.pipe(
          map(c => {
            if (count > 1) {
              this.multi = true;
            }
            return this.setURL();
          })
        );
      }
    }
  }
}
