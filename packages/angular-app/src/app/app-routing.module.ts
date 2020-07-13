import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from '../edit';
import { ExamineComponent } from '../examine';
import { HomeComponent } from '../home';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'examine', component: ExamineComponent },
  { path: 'edit', component: EditComponent },
  { path: '', redirectTo: 'home', pathMatch:'full'},
  //{ path: 'edit/:id', component: EditComponent }, // Why is this needed??
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
