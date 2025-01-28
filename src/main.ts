import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideExperimentalZonelessChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { initializeApp } from "@firebase/app";

import { AppComponent } from "./app/app.component";
import { DirtyFormGuard } from "./app/guards/dirty-form.guard";
import { environment } from "./environments/environment";
import { routes } from "./routes";

initializeApp(environment.firebase); // TODO: Proper environments

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    DirtyFormGuard,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
}).catch(console.error);
