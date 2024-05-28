import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UsersService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private userService: UsersService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return from(this.userService.isUserLogin()).pipe(
      switchMap((isLoggedIn) => {
        if (isLoggedIn) {
          return from(this.userService.isUserLogin()).pipe(
            map((isUserLoggedInAgain) => {
              if (isUserLoggedInAgain) {
                return true;
              } else {
                this.router.navigate(['/home']);
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/home']);
          return from([false]);
        }
      })
    );
  }
}
