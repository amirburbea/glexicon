import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetTermsResult, TermData, Term } from '@glexicon/objects';
import { map } from 'rxjs/operators';

@Injectable()
export class TermsService {
  constructor(private http: HttpClient) {}

  getTerms(pageSize: number, searchText?: string, page: number = 1) {
    let url = `http://localhost:8080/api/terms?pageSize=${pageSize}&page=${page}`;
    if (searchText) {
      url += `&search=${encodeURIComponent(searchText)}`;
    }
    return this.http.get<GetTermsResult>(url);
  }

  createTerm(data: TermData) {
    return this.http
      .put('http://localhost:8080/api/term', data, {
        responseType: 'text',
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(map(idText => Number(idText)));
  }

  getTerm(id: number) {
    return this.http.get<Term>(`http://localhost:8080/api/term/${id}`);
  }

  deleteTerm(id: number) {
    return this.http.delete(`http://localhost:8080/api/term/${id}`);
  }

  updateTerm(id: number, data: TermData) {
    return this.http.post<Term>(`http://localhost:8080/api/term/${id}`, data);
  }
}
