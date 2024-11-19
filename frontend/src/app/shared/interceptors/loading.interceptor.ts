import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../../services/loading.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

var pendingRequest = 0;
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoadingService);

  loadingService.showLoading();
  pendingRequest++;

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          handleHideLoading();
        }
      },
      error: (_) => {
        handleHideLoading();
      }
    })
  );

  function handleHideLoading() {
    pendingRequest--;
    if (pendingRequest === 0) {
      loadingService.hideLoading();
    }
  }
};
