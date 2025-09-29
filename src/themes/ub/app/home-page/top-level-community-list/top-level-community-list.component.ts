import { Component } from '@angular/core';
import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'],
  // styleUrls: ['../../../../../app/home-page/top-level-community-list/top-level-community-list.component.scss'],
  templateUrl: './top-level-community-list.component.html'
  // templateUrl: '../../../../../app/home-page/top-level-community-list/top-level-community-list.component.html'
})

export class TopLevelCommunityListComponent extends BaseComponent {
/** get info from the community */
getCommunityTitle(community: any) {
  let title = community.metadata['dc.title'][0];
  // if no title, return an empty string
  if (!title) {
    return '';
  }
  return title.value;
}

getCommunityLink(community: any) {
  let link = community['_links']['self'];
  //uuid millor
  let uuid = community['uuid'];
  // if no title, return an empty string
  //if (!link) {
  if (!uuid) {
    return '/';
  }
  return '/communities/' + uuid;
}



}

