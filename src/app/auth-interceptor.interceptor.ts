import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //If token is present in Session then adding token in Authorization header
    let token = sessionStorage.getItem('userToken');
    if (token) {
      return next.handle(
        request.clone({ headers: request.headers.set('Authorization', token) })
      );
    }
    return next.handle(request);
  }
}
