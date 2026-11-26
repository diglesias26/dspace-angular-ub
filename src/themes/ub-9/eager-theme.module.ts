import { NgModule } from '@angular/core';

import { FooterComponent } from './app/footer/footer.component';
import { HeaderComponent } from './app/header/header.component';
import { HomeNewsComponent } from './app/home-page/home-news/home-news.component';
import { UntypedItemComponent } from './app/item-page/simple/item-types/untyped-item/untyped-item.component';

// These DSpace entry components must be imported early so their decorators populate the registry.
// This is a DSpace convention, independent of Angular's former entryComponents option.
const ENTRY_COMPONENTS = [UntypedItemComponent];

@NgModule({
  imports: [
    FooterComponent,
    HeaderComponent,
    HomeNewsComponent,
    ...ENTRY_COMPONENTS,
  ],
  providers: ENTRY_COMPONENTS.map((component) => ({ provide: component })),
})
export class EagerThemeModule {}
