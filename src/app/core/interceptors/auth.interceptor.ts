import { HttpInterceptorFn } from '@angular/common/http';
import { AuthHelper } from '../helpers/auth.helper';

const EXCLUDE = [
  '/auth/authenticate', 
  '/auth/register'
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (EXCLUDE.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const token = AuthHelper.getAccessToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
