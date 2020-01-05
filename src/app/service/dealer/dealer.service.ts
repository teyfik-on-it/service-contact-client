import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { share, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { transformAndValidate } from 'src/helper/transform-and-validate';
import { Dealer } from './entity/dealer';
import { fromValidate } from 'src/helper/from-validate';
import { CreateDealer } from './payload/create-dealer';
import { Subject } from 'rxjs';
import { PaginatorService } from 'src/app/service/paginate/paginator.service';

@Injectable({
  providedIn: 'root',
})
export class DealerService {
  private readonly dealersSubject = new Subject<void>();

  constructor(
    private readonly httpClient: HttpClient,
    private readonly paginatorService: PaginatorService,
  ) {
  }

  dealers = this.dealersSubject.pipe(
    startWith(null),
    switchMap(() => this.httpClient.get<object[]>('/dealer')),
    transformAndValidate(Dealer),
    shareReplay(1),
  );

  createDealer(createDealer: CreateDealer) {
    return fromValidate(CreateDealer, createDealer).pipe(
      switchMap(body => this.httpClient.post('/dealer', body)),
      tap(() => this.dealersSubject.next(null)),
      transformAndValidate(Dealer),
      share(),
    );
  }

  paginate() {
    return this.paginatorService.paginate('/dealer', Dealer, this.dealersSubject);
  }

  delete(dealer: Dealer) {
    return this.httpClient.delete('/dealer/' + dealer._id).pipe(
      tap(() => this.dealersSubject.next(null)),
    ).toPromise();
  }

  deleteBatch(dealers: Dealer[]) {
    return Promise.all(dealers.map(dealer => this.delete(dealer)));
  }
}
