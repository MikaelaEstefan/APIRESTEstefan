import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UsersService } from './users.service';

// Mock MatDialog
class MatDialogMock {
  open() {
    return { afterClosed: () => of(null) }; 
  }
}

// Mock UsersService
class UsersServiceMock {
  getUsers() {
    return of([]);
  }

  createUser(user: any) {
    return of([]);
  }

  updateUser(userId: any, user: any) {
    return of([]);
  }
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UsersComponent],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: UsersService, useClass: UsersServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addUser and update users$', () => {
    spyOn(component.matDialog, 'open').and.returnValue({ afterClosed: () => of({}) });
    spyOn(component.usersService, 'createUser').and.returnValue(of([{ id: 1, name: 'New User' }]));

    component.addUser();

    expect(component.matDialog.open).toHaveBeenCalled();
    expect(component.usersService.createUser).toHaveBeenCalled();
    expect(component.users$).toBeDefined(); 
  });

  it('should call onEditUser and update users$', () => {
    const user = { id: 1, name: 'Existing User' };
    spyOn(component.matDialog, 'open').and.returnValue({ afterClosed: () => of({}) });
    spyOn(component.usersService, 'updateUser').and.returnValue(of([{ id: 1, name: 'Updated User' }]));

    component.onEditUser(user);

    expect(component.matDialog.open).toHaveBeenCalled();
    expect(component.usersService.updateUser).toHaveBeenCalledWith(user.id, {});
    expect(component.users$).toBeDefined(); 
  });

  it('should call onDeleteUser', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.onDeleteUser(1);

    
  });
});

export { UsersComponent };

