import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';
import { Token, User, Wallet } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';
import { LayoutService } from './layout.service';
import { Order } from '../interfaces/order.interface';
import { PayResponse } from '../interfaces/payReponse.interface';
import { Notification } from '../interfaces/notification.interface';
import { Credit } from '../interfaces/credit.interface';
import { Retreat } from '../interfaces/retreat.interface';

interface StateUser {
  user: User | null;
  token: string;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  #state = signal<StateUser>({
    user: null,
    token: '',
    loading: false,
  });

  public user = computed(() => this.#state().user);
  public token = computed(() => this.#state().token);
  public loading = computed(() => this.#state().loading);

  // public user?: Token | null;
  public authService = inject(AuthService);
  public layoutService = inject(LayoutService);

  public limit = 5;
  public offset = 0;

  public notifications: Notification[] = [];
  public hasMoreNotifications: boolean = true;

  public hasMoreCredits: boolean = true;
  public hasMoreRetreats: boolean = true;

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token()}`,
    });
  }

  constructor(
    private http: HttpClient,
    public router: Router,
    public location: Location
  ) {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      const userString = localStorage.getItem('user');
      const tokenString = localStorage.getItem('token');
      this.authService.setAuthenticationStatus(true);

      if (!this.layoutService.isMobile()) {
        this.layoutService.state.profileSidebarVisible = true;
      }

      this.#state.set({
        loading: false,
        token: tokenString!,
        user: JSON.parse(userString!),
      });

      this.refreshUser();
      this.getNotifications();
    } else {
      this.authService.setAuthenticationStatus(false);
      this.#state.set({
        loading: false,
        token: '',
        user: null,
      });
    }
    console.log(this.user());
  }

  async isUserLogin(): Promise<boolean> {
    return !!this.token();
  }

  public isIdUser() {
    return this.user()?.id_user!;
  }

  public closeSession() {
    this.authService.setAuthenticationStatus(false);
    this.router.navigate(['/home']);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.#state.set({
      loading: false,
      token: '',
      user: null,
    });
    this.layoutService.state.profileSidebarVisible = false;
  }

  public openSession(resUser: Token) {
    this.#state.set({
      loading: false,
      token: resUser.access_token,
      user: resUser.user,
    });
    localStorage.setItem('user', JSON.stringify(resUser.user));
    localStorage.setItem('token', resUser.access_token);
    if (!this.layoutService.isMobile()) {
      this.layoutService.state.profileSidebarVisible = true;
    }
    console.log(this.user());
  }

  // sendEmailRecover(email: {
  //   email: string;
  // }): Observable<{ status: number; message: string }> {
  //   return this.http.post<{ status: number; message: string }>(
  //     `${environment.url_api}/email/recover`,
  //     email
  //   );
  // }

  // resetPassword(resetPassword: {
  //   token: string;
  //   newPassword: string;
  // }): Observable<{ status: number; message: string }> {
  //   return this.http.post<{ status: number; message: string }>(
  //     `${environment.url_api}/auth/reset-password`,
  //     resetPassword
  //   );
  // }

  public logInUser(request: {
    email: string;
    password: string;
  }): Observable<Token> {
    this.#state.set({
      loading: true,
      token: '',
      user: null,
    });
    return this.http
      .post<Token>(`${environment.url_api}/auth/login`, request)
      .pipe(
        tap((resp) => {
          if (resp.access_token) {
            this.openSession(resp);
          } else {
            console.error(
              'La respuesta del servidor no contiene un token válido:',
              resp
            );
          }
        }),
        catchError((error) => {
          this.#state.set({
            loading: false,
            token: '',
            user: null,
          });
          console.error('Error en el inicio de sesión:', error);
          return throwError(error);
        })
      );
  }

  public async refreshUser(): Promise<void> {
    this.#state.set({
      user: this.#state().user,
      loading: true,
      token: this.#state().token,
    });
    this.http
      .get<User>(`${environment.url_api}/users/${this.isIdUser()}`)
      .subscribe(
        (res) => {
          console.log(res);
          this.#state.set({
            user: res,
            loading: false,
            token: this.#state().token,
          });

          localStorage.setItem('user', JSON.stringify(res));
        },
        (error) => {}
      );
  }

  public getNotifications(): void {
    const userId = this.isIdUser();
    this.http
      .get<Notification[]>(
        `${environment.url_api}/notifications/byUser/${userId}/${this.limit}/${this.offset}`
      )
      .subscribe(
        (res: Notification[]) => {
          if (res.length < this.limit) {
            this.hasMoreNotifications = false;
          }
          this.offset += this.limit;
          this.notifications = [...this.notifications, ...res];

          if (this.notifications[0].photo === 'p49.png') {
            this.closeSession();
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        },
        (error) => {
          this.hasMoreNotifications = false;
        }
      );
  }

  public getCredits(limit: number, offset: number) {
    const walletId = this.user()!.walletId;
    return this.http
      .get<Credit[]>(
        `${environment.url_api}/credits/byWallet/${walletId}/${limit}/${offset}`
      )
      .pipe(
        tap((res: Credit[]) => {
          if (res.length < limit) {
            this.hasMoreCredits = false;
          }
        }),
        catchError((error) => {
          this.hasMoreCredits = false;
          throw error;
        })
      );
  }

  public postCredit(credit: Partial<Credit>) {
    return this.http.post<Credit>(`${environment.url_api}/credits`, credit);
  }

  public getRetreats(limit: number, offset: number) {
    const walletId = this.user()!.walletId;
    return this.http
      .get<Retreat[]>(
        `${environment.url_api}/retreats/byWallet/${walletId}/${limit}/${offset}`
      )
      .pipe(
        tap((res: Retreat[]) => {
          if (res.length < limit) {
            this.hasMoreRetreats = false;
          }
        }),
        catchError((error) => {
          this.hasMoreRetreats = false;
          throw error;
        })
      );
  }

  public postRetreat(
    retreat: Partial<Retreat>
  ): Observable<{ retreat: Retreat; wallet: Wallet }> {
    return this.http
      .post<{ retreat: Retreat; wallet: Wallet }>(
        `${environment.url_api}/retreats`,
        retreat
      )
      .pipe(
        tap((res) => {
          this.#state().user!.wallet = res.wallet;
          this.#state.set({
            user: this.#state().user,
            token: this.#state().token,
            loading: false,
          });
          localStorage.setItem('user', JSON.stringify(this.user()));
        })
      );
  }

  public updateNotifications(): void {
    setTimeout(() => {
      const notificationsUnread = this.notifications.filter(
        (notification) => notification.isRead === 0
      );

      const updateRequests = notificationsUnread.map((notification) => {
        const updateNotification: Partial<Notification> = {
          isRead: 1,
          tittle: notification.tittle,
          photo: notification.photo,
        };

        return this.http
          .patch<Notification>(
            `${environment.url_api}/notifications/${notification.id_notification}`,
            updateNotification
          )
          .toPromise()
          .then((res) => {
            const index = this.notifications.findIndex(
              (n) => n.id_notification === res!.id_notification
            );
            if (index !== -1) {
              this.notifications[index] = res!;
            }
          })
          .catch((error) => {
            console.error('Error updating notification:', error);
          });
      });

      Promise.all(updateRequests).then(() => {
        console.log('All notifications updated successfully');
      });
    }, 3000);
  }

  public postUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${environment.url_api}/users`, user).pipe();
  }

  public updateUser(dataUser: Partial<User>): Observable<User> {
    if (!this.user()) {
      return throwError('Ingrese con su usuario primero');
    }

    return this.http.patch<User>(
      `${environment.url_api}/Users/${this.isIdUser()}`,
      dataUser,
      {
        headers: this.headers(),
      }
    );
  }

  public getOrdersByUser(): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${environment.url_api}/orders/byUser/${this.isIdUser()}`
    );
  }

  public payOrder(idOrder: number): Observable<PayResponse> {
    const data = {
      idUser: this.isIdUser(),
    };
    return this.http
      .patch<PayResponse>(
        `${environment.url_api}/orders/payOrder/${idOrder}`,
        data
      )
      .pipe(
        tap((payResponse) => {
          console.log(this.#state());

          this.notifications.unshift(payResponse.notification);

          const user = { ...this.user() } as User;

          user.wallet = payResponse.wallet;
          const indexOrder = user.phase!.orders!.length - 1;

          user.phase!.orders![indexOrder] = payResponse.order;
          console.log(user.phase?.orders);

          this.#state.set({
            user: user,
            token: this.#state().token,
            loading: false,
          });

          console.log(this.#state().user);

          localStorage.setItem('user', JSON.stringify(this.user()));
        })
      );
  }

  public updateUserVIP(): Observable<User> {
    this.#state.set({
      user: this.#state().user,
      token: this.#state().token,
      loading: true,
    });
    return this.http
      .get<User>(`${environment.url_api}/users/updateVIP/${this.isIdUser()}`)
      .pipe(
        tap((res) => {
          this.#state.set({
            user: res,
            token: this.#state().token,
            loading: false,
          });

          localStorage.setItem('user', JSON.stringify(this.user()));
        })
      );
  }
}
