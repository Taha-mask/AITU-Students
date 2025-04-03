import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentDistributionComponent } from './components/student-distribution/student-distribution.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'students-distribution', component: StudentDistributionComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
