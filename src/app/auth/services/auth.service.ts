import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { LoginPayload } from '../models';
import { environment } from 'src/environments/environment.local';
import { of } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should login successfully', fakeAsync(() => {
    const loginPayload: LoginPayload = { email: 'test@example.com', password: 'password' };
    const mockUser = { /* your mock user data here */ };

    authService.login(loginPayload);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}/users?email=${loginPayload.email}&password=${loginPayload.password}`
    );

    req.flush([mockUser]);

    tick();

    expect(authService.authUser$).toBeTruthy();
    authService.authUser$.subscribe((user: any) => {
      expect(user).toEqual(mockUser); 
    });
  }));

  it('should handle login error', fakeAsync(() => {
    const loginPayload: LoginPayload = { email: 'invalid@example.com', password: 'wrongpassword' };

    authService.login(loginPayload);

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}/users?email=${loginPayload.email}&password=${loginPayload.password}`
    );

    req.error(new ErrorEvent('Fake error'));

    tick();

   
  }));

  it('should verify token successfully', fakeAsync(() => {
    const mockUser = {  };
    localStorage.setItem('token', mockUser.token);

    authService.verifyToken();

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}/users?token=${localStorage.getItem('token')}`
    );

    req.flush([mockUser]);

    tick();

    authService.authUser$.subscribe((user: any) => {
      expect(user).toEqual(mockUser);
    });
  }));

  it('should handle verifyToken error', fakeAsync(() => {
    localStorage.setItem('token', 'invalid-token');

    authService.verifyToken();

    const req = httpTestingController.expectOne(
      `${environment.baseUrl}/users?token=${localStorage.getItem('token')}`
    );

    req.error(new ErrorEvent('Fake error'));

    tick();

    
  }));

  it('should logout successfully', fakeAsync(() => {
    const mockUser = { };
    authService.authUser$ = of(mockUser);

    authService.logout();

    authService.authUser$.subscribe((user: any) => {
      expect(user).toBeNull();
    });

    expect(localStorage.getItem('token')).toBeNull();
  }));

  it('should handle logout error', fakeAsync(() => {
    const mockUser = {  };
    authService.authUser$ = of(mockUser);

    authService.logout();

    authService.authUser$.subscribe((user: any) => {
      expect(user).toBeNull();
    });

    expect(localStorage.getItem('token')).toBeNull();
   
  }));
});
export { AuthService };

