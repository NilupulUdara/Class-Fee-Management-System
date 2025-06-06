import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { StudentAddComponent } from './components/student-add/student-add.component';
import { StudentViewComponent } from './components/student-view/student-view.component';
import { SubjectAddComponent } from './components/subject-add/subject-add.component';
import { SubjectEditComponent } from './components/subject-edit/subject-edit.component';
import { FeesComponent } from './components/fees/fees.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'studentadd', component: StudentAddComponent },
    { path: 'studentview', component: StudentViewComponent },
    { path: 'subjectadd', component: SubjectAddComponent },
    { path: 'subjectedit', component: SubjectEditComponent },
    { path: 'fees', component: FeesComponent }
];
