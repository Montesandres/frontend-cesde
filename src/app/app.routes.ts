import { Routes } from '@angular/router';
import { ProfessorsComponent } from './professors/professors.component';
import { SubjectsComponent } from './subjects/subjects.component';

export const routes: Routes = [
  { path: 'professors', component: ProfessorsComponent },
  { path: 'subjects', component: SubjectsComponent },
];
