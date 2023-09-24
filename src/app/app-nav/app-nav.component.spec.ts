import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppNavComponent } from './app-nav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MockAuthService, MockSyncTeamsService } from './mocks/mockServices';
import { SyncTeamsService } from '../services/sync-teams.service';

describe('AppNavComponent', () => {
  let component: AppNavComponent;
  let fixture: ComponentFixture<AppNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppNavComponent],
      imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: SyncTeamsService, useClass: MockSyncTeamsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show login link when user is not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();
    const loginLink = fixture.nativeElement.querySelector(
      'a[routerLink="login"]'
    );
    expect(loginLink).toBeTruthy();
  });

  it('should show my teams link when user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const myTeamsLink = fixture.nativeElement.querySelector(
      'a[routerLink="teams"]'
    );
    expect(myTeamsLink).toBeTruthy();
  });

  it('should show transactions link when user is logged in and has transactions enabled', () => {
    component.isLoggedIn = true;
    component.hasTransactionsEnabled = true;
    fixture.detectChanges();
    const transactionsLink = fixture.nativeElement.querySelector(
      'a[routerLink="transactions"]'
    );
    expect(transactionsLink).toBeTruthy();
  });

  it('should not show transactions link when user is logged in but does not have transactions enabled', () => {
    component.isLoggedIn = true;
    component.hasTransactionsEnabled = false;
    fixture.detectChanges();
    const transactionsLink = fixture.nativeElement.querySelector(
      'a[routerLink="transactions"]'
    );
    expect(transactionsLink).toBeFalsy();
  });

  it('should show profile link when user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const profileLink = fixture.nativeElement.querySelector(
      'a[routerLink="profile"]'
    );
    expect(profileLink).toBeTruthy();
  });

  it('should show how it works link', () => {
    const howItWorksLink = fixture.nativeElement.querySelector(
      'a[routerLink="about"]'
    );
    expect(howItWorksLink).toBeTruthy();
  });

  it('should show contact link when user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    const contactLink = fixture.nativeElement.querySelector(
      'a[routerLink="feedback"]'
    );
    expect(contactLink).toBeTruthy();
  });

  it('should not show contact link when user is not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();
    const contactLink = fixture.nativeElement.querySelector(
      'a[routerLink="feedback"]'
    );
    expect(contactLink).toBeFalsy();
  });

  it('should set role to dialog when on handset', () => {
    component.isHandset$ = of(true);
    fixture.detectChanges();
    const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
    expect(sidenav.getAttribute('role')).toBe('dialog');
  });

  it('should set role to navigation when not on handset', () => {
    component.isHandset$ = of(false);
    fixture.detectChanges();
    const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
    expect(sidenav.getAttribute('role')).toBe('navigation');
  });

  it('should set mode to over when on handset', () => {
    component.isHandset$ = of(true);
    fixture.detectChanges();
    const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
    expect(sidenav.getAttribute('mode')).toBe('over');
  });

  it('should set mode to side when not on handset', () => {
    component.isHandset$ = of(false);
    fixture.detectChanges();
    const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
    expect(sidenav.getAttribute('mode')).toBe('side');
  });

  it('should set opened to false when not on handset', () => {
    component.isHandset$ = of(false);
    fixture.detectChanges();
    const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
    expect(sidenav.getAttribute('opened')).toBe('false');
  });

  it('should set opened to true when on handset', () => {
    component.isHandset$ = of(true);
    fixture.detectChanges();
    const sidenav = fixture.nativeElement.querySelector('mat-sidenav');
    expect(sidenav.getAttribute('opened')).toBe('true');
  });

  it('should show menu toolbar', () => {
    const toolbar = fixture.nativeElement.querySelector('mat-toolbar');
    expect(toolbar.textContent).toContain('Menu');
  });
});
