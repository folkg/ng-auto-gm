import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';
import { environment } from '../environments/environment';

import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppNavComponent } from './app-nav/app-nav.component';
import { FeedbackModule } from './feedback/feedback.module';
import { DirtyFormGuard } from './guards/dirty-form.guard';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProfileModule } from './profile/profile.module';
import { TeamsModule } from './teams/teams.module';

@NgModule({
  declarations: [AppComponent, AppNavComponent, NotfoundComponent],
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
    MatTooltipModule,
    MatListModule,
    TeamsModule,
    ProfileModule,
    FeedbackModule,
    AppRoutingModule,
  ],
  providers: [DirtyFormGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
