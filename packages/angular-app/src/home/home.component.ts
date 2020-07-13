import { Component, OnInit } from '@angular/core';
import { GetTermsResult } from '@glexicon/objects';
import { TermsService } from 'src/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private termsService: TermsService) {}

  results?: GetTermsResult;
  searchText = '';

  ngOnInit() {
    this.termsService
      .getTerms(PAGE_SIZE)
      .subscribe(res => (this.results = res));
  }

  onSubmit() {
    const { searchText, termsService } = this;
    termsService
      .getTerms(PAGE_SIZE, searchText.trim() || undefined)
      .subscribe(res => (this.results = res));
  }

  getPagesRange() {
    const { results } = this;
    if (!results) {
      return;
    }
    const array = [];
    for (let page = 1; page <= Math.ceil(results.total / PAGE_SIZE); page++) {
      array.push(page);
    }
    return array;
  }

  goToPage(page: number) {
    const { searchText, termsService } = this;
    termsService
      .getTerms(PAGE_SIZE, searchText.trim() || undefined, page)
      .subscribe(res => (this.results = res));
  }
}

const PAGE_SIZE = 2;
