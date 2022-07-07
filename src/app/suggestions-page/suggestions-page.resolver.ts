import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { hasValue } from '../shared/empty.util';
import { SuggestionsDataService } from '../core/suggestion-notifications/reciter-suggestions/suggestions-data.service';
import { SuggestionTarget } from '../core/suggestion-notifications/reciter-suggestions/models/suggestion-target.model';

/**
 * This class represents a resolver that requests a specific collection before the route is activated
 */
@Injectable()
export class SuggestionsPageResolver implements Resolve<RemoteData<SuggestionTarget>> {
  constructor(private suggestionsDataService: SuggestionsDataService) {
  }

  /**
   * Method for resolving a suggestion target based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Collection>> Emits the found collection based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<SuggestionTarget>> {
    return this.suggestionsDataService.getTargetById(route.params.targetId).pipe(
      find((RD) => hasValue(RD.hasFailed) || RD.hasSucceeded),
    );
  }
}
