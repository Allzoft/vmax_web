import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from './auth.service';
import { Token, User } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';
import { LayoutService } from './layout.service';
import { Order } from '../interfaces/order.interface';
import { PayResponse } from '../interfaces/payReponse.interface';
import { Notification } from '../interfaces/notification.interface';
import { Credit } from '../interfaces/credit.interface';
import { Retreat } from '../interfaces/retreat.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public user?: Token | null;
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
      Authorization: `Bearer ${this.user?.access_token}`,
    });
  }

  constructor(
    private http: HttpClient,
    public router: Router,
    public location: Location
  ) {
    if (localStorage.getItem('user')) {
      const userString = localStorage.getItem('user');
      this.authService.setAuthenticationStatus(true);
      this.layoutService.state.profileSidebarVisible = true;
      this.user = JSON.parse(userString!);
      this.refreshUser();
      this.getNotifications();
    } else {
      this.authService.setAuthenticationStatus(false);
      this.user = null;
    }
    console.log(this.user);
  }

  async isUserLogin(): Promise<boolean> {
    return !!this.user?.access_token;
  }

  public isIdUser() {
    return this.user!.user.id_user!;
  }

  public closeSession() {
    this.authService.setAuthenticationStatus(false);

    this.router.navigate(['/home']);

    localStorage.removeItem('user');
    this.user = null;
    this.layoutService.state.profileSidebarVisible = false;
  }

  public openSession(resUser: Token) {
    this.user = resUser;
    localStorage.setItem('user', JSON.stringify(resUser));
    this.layoutService.state.profileSidebarVisible = true;
    console.log(this.user);
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
    return this.http
      .post<Token>(`${environment.url_api}/auth/login`, request)
      .pipe(
        tap((resp) => {
          if (resp.access_token) {
            localStorage.setItem('token', resp.access_token);
            this.openSession(resp);
          } else {
            console.error(
              'La respuesta del servidor no contiene un token válido:',
              resp
            );
          }
        }),
        catchError((error) => {
          console.error('Error en el inicio de sesión:', error);
          return throwError(error);
        })
      );
  }

  public async refreshUser(): Promise<void> {
    this.http
      .get<User>(`${environment.url_api}/users/${this.isIdUser()}`)
      .subscribe((res) => {
        console.log(res);

        this.user!.user = res;
        localStorage.setItem('user', JSON.stringify(this.user!));
      });
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
        },
        (error) => {
          this.hasMoreNotifications = false;
        }
      );
  }

  public getCredits(limit: number, offset: number) {
    const walletId = this.user?.user.walletId;
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
    const walletId = this.user?.user.walletId;
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

  public postRetreat(retreat: Partial<Retreat>) {
    return this.http.post<Retreat>(`${environment.url_api}/retreats`, retreat);
  }

  public updateNotifications(): void {
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
  }

  public postUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${environment.url_api}/users`, user).pipe();
  }

  public updateUser(dataUser: Partial<User>): Observable<User> {
    if (!this.user) {
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
          this.user!.user.wallet = payResponse.wallet;
          const indexOrder = this.user!.user.phase!.orders!.findIndex(
            (order) => {
              order.id_order === payResponse.order.id_order;
            }
          );
          this.user!.user.phase!.orders![indexOrder] = payResponse.order;
          // localStorage.setItem('user', JSON.stringify(this.user!.user));
        })
      );
  }
}
