import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


export interface AuthResponseData{
  idToken :	string
  email :	string	
  refreshToken :	string	
  expiresIn :	string	
  localId :	string
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  //user = new Subject<User>();
  user = new BehaviorSubject<User>(null); //it behaves just like the other subjects which means we can call next() to emit a value and we can
  //subscribe it to be informed about new values. The difference is the BehaviorSubject also gives subscribers imediate access to the
  // priviously emitted value even if they havent subscribe at the point of time that value was emitted that means we can get access to 
  //the currently activate user even if we only subscribe after that user has been emitted.


  private tokenExpirationTimer :any;

  constructor(private http: HttpClient,
              private route: Router) { }

  // signUp(email: string, password: string) {
  //   return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDTeFdJSsjrrE8ENRtT4fCqwzSNwwB2R0k',
  //   {
  //     email: email,
  //     password: password,
  //     returnSecureToken: true
  //   }).pipe(catchError(errorRes => {
  //     let errorMessage = 'An unknown error occurred!';
  //     if(!errorRes.error || !errorRes.error.error){
  //       return throwError(errorMessage);
  //     }
  //     switch(errorRes.error.error.message){
  //       case 'EMAIL_EXISTS':
  //         errorMessage = 'The Email id is exists already!';
  //     }
  //     return throwError(errorMessage);
  //   }));
  // }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    ).pipe(catchError(this.handleError), tap(
      resData => {
        this.handleAunthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn) //use + because this is number
      }
    )
    );
  }

  login(email:string, password:string){
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError(this.handleError), tap(
      resData => {
        this.handleAunthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn) //use + because this is number
      }
    )
    );
  }

  autoLogin(){
    const userData:{
      email: string,
      id: string,
      _token: string,
      _tokenexpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
    const loadUser= new User(
      userData.email, 
      userData.id, 
      userData._token, 
      new Date(userData._tokenexpirationDate)
    );

    if(loadUser.token){
      this.user.next(loadUser);
      const expirationDuration = new Date(userData._tokenexpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout(){
    this.user.next(null);
    this.route.navigate(['/auth']);

    localStorage.removeItem('userData');

    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number){
    console.log(expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAunthentication(email:string, userId:string, token:string, expiresIn:number){
    const expirationDate = new Date(new Date(). getTime() + expiresIn * 1000); //Conversion of mili sec to date
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);

    this.autoLogout(expiresIn * 1000);
    //for store the login data into a local strorage of browser
    localStorage.setItem('userData', JSON.stringify(user)); //convert user to string use JSON.stringify()
  }

  private handleError(errorRes : HttpErrorResponse){
    let errorMessage = 'An unknown error occurred!';
      if(!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      }
      switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage = 'The Email id is exists already!';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This email does not exists!';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'This password is not correct!';
          break;
      }
      return throwError(errorMessage);
  }
}
