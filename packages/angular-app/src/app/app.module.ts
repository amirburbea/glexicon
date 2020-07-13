import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EditComponent } from '../edit';
import { ExamineComponent } from '../examine';
import { HomeComponent } from '../home';
import { TermsService } from '../services';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, ExamineComponent, EditComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [TermsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
