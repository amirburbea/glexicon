import { Component, OnInit } from '@angular/core';
import { GetTermsResult } from '@glexicon/objects';
import { TermsService } from 'src/services';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private lastSearch?: string;

  results?: GetTermsResult;

  readonly form = new FormGroup({
    searchText: new FormControl(''),
  });

  constructor(private termsService: TermsService) {}

  ngOnInit() {
    this.termsService
      .getTerms(PAGE_SIZE)
      .subscribe(res => (this.results = res));
  }

  onSubmit() {
    const { form, termsService } = this;
    termsService
      .getTerms(
        PAGE_SIZE,
        (this.lastSearch = form.get('searchText')!.value.trim() || undefined)
      )
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
    const { lastSearch, termsService } = this;
    termsService
      .getTerms(PAGE_SIZE, lastSearch, page)
      .subscribe(res => (this.results = res));
  }
}

const PAGE_SIZE = 2;
