import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from '../home';
import { EditComponent } from '../edit';
import { ExamineComponent } from '../examine';

@NgModule({
  declarations: [AppComponent, HomeComponent, ExamineComponent, EditComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
