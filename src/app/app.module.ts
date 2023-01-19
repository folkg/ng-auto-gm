import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import {
  connectFunctionsEmulator,
  provideFunctions,
  getFunctions,
} from '@angular/fire/functions';

import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { NotfoundComponent } from './notfound/notfound.component';
import { TeamsModule } from './teams/teams.module';
import { ProfileModule } from './profile/profile.module';
import { DirtyFormGuard } from './guards/dirty-form.guard';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AboutComponent } from './about/about.component';
import { FeedbackComponent } from './feedback/feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppNavComponent,
    NotfoundComponent,
    ConfirmDialogComponent,
    AboutComponent,
    FeedbackComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    TeamsModule,
    ProfileModule,
    AppRoutingModule,
  ],
  providers: [DirtyFormGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
