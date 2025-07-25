import { Component } from '@angular/core';
import {
  MediaViewerComponent as BaseComponent
} from '../../../../../app/item-page/media-viewer/media-viewer.component';

@Component({
  selector: 'ds-media-viewer',
  templateUrl: './media-viewer.component.html',
  // templateUrl: '../../../../../app/item-page/media-viewer/media-viewer.component.html',
  // styleUrls: ['./media-viewer.component.scss'],
  styleUrls: ['../../../../../app/item-page/media-viewer/media-viewer.component.scss'],
})
export class MediaViewerComponent extends BaseComponent {
  // inento agafar-la de D:\dspace7-source\dspace-angular-ub\src\themes\ub\assets\images
  // però no funciona:
  // thumbnailPlaceholder = '../../../../../assets/images/no-thumbnail.png';
  // thumbnailPlaceholder = './themes/ub/assets/images/no-thumbnail.png';

  // l'agafo de D:\dspace7-source\dspace-angular-ub\src\assets\images
  thumbnailPlaceholder = './assets/images/no-thumbnail.png';

}
