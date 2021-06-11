import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import {
  FilterCockpit,
  Pageable,
  Sort,
} from 'app/shared/backend-models/interfaces';
import { Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import {
  UserResponse,
} from '../../shared/view-models/interfaces';
import { TranslocoService } from '@ngneat/transloco';

@Injectable()
export class AdminCockpitService {
  private readonly getUserRestPath: string =
    'usermanagement/v1/user/search';
  private readonly postUserData: string =
    'usermanagement/v1/user';
  private readonly deleteUserDataPath: string =
    'usermanagement/v1/user';
  private readonly passwordResetLinkPath: string =
    'usermanagement/v1/user/resetlink';
  private readonly searchUserByUsernameRestPath: string =
    'usermanagement/v1/user/search';
  private readonly restServiceRoot$: Observable<
    string
  > = this.config.getRestServiceRoot();

  usersChanged = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private translocoService: TranslocoService,
  ) {
    this.translocoService.langChanges$.subscribe((event: any) => {

    });
  }
    sorting: Sort[];
    filters: FilterCockpit;


  getUsers(
    pageable: Pageable,
    sorting: Sort[],
    filters: FilterCockpit,
  ): Observable<UserResponse[]> {
    let path: string;
    filters.pageable = pageable;
    filters.pageable.sort = sorting;
    if (true) {
      path = this.getUserRestPath;
    }
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<UserResponse[]>(`${restServiceRoot}${path}`, filters),
      ),
    );
  }

  updateUser(user: any): Observable<UserResponse[]> {
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<UserResponse[]>(`${restServiceRoot}${this.postUserData}`, user),
      ),
    );
  }

  deleteUser(userId: number): Observable<UserResponse[]> {
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.delete<UserResponse[]>(`${restServiceRoot}${this.deleteUserDataPath}`+'/'+userId),
      ),
    );
  }

  sendPasswordResetEmail(user: any): Observable<UserResponse[]> {
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.post<UserResponse[]>(`${restServiceRoot}${this.passwordResetLinkPath}`, user),
      ),
    );
  }

  getUserByName(username: string): Observable<UserResponse[]> {
    return this.restServiceRoot$.pipe(
      exhaustMap((restServiceRoot) =>
        this.http.get<UserResponse[]>(`${restServiceRoot}${this.searchUserByUsernameRestPath}` + "/" + username),
      ),
    );
  }

  emitUsersChanged() {
    this.usersChanged.emit(true);
  }
}
