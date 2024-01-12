import { Component, Inject, OnInit } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-page.component';
import { Context } from '../../../../core/shared/context.model';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ViewMode } from '../../../../core/shared/view-mode.model';


@Component({
  selector: 'ds-admin-notify-incoming',
  templateUrl: './admin-notify-incoming.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class AdminNotifyIncomingComponent implements OnInit{
  public selectedSearchConfig$: Observable<string>;
  public defaultConfiguration = 'NOTIFY.incoming';
  public isLoading = true;


  protected readonly context = Context.CoarNotify;
  constructor(@Inject(SEARCH_CONFIG_SERVICE) public searchConfigService: SearchConfigurationService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.selectedSearchConfig$ = this.searchConfigService.getCurrentConfiguration(this.defaultConfiguration).pipe(
        tap(() => this.isLoading = false)
    );
  }

  public resetDefaultConfiguration() {
    this.router.navigate([this.getResolvedUrl(this.route.snapshot)], {
      queryParams: {
        configuration: this.defaultConfiguration,
        view: ViewMode.Table
      },
    });
  }

  /**
   *
   * @param route url path
   * @returns url path
   */
  private getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
  }
}
