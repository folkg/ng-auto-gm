import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';

//TODO: Subscribe to the user$ observable in the auth service here instead of the yahoo-teams service

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const newRequest = request.clone({
      headers: new HttpHeaders({
        token: 'Bearer ' + '1234556',
      }),
    });
    //TODO: if yahoo, add token, else pass original request. Maybe add one for Google too?
    return next.handle(newRequest);
  }
}
