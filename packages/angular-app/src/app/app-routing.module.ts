import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from 'src/edit';
import { ExamineComponent } from '../examine';
import { HomeComponent } from '../home';

const routes: Routes = [
  { path: 'examine', component: ExamineComponent },
  { path: 'edit', component: EditComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
