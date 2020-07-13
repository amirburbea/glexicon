import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Term } from '@glexicon/objects';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';
import { TermsService } from 'src/services';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  private readonly destroyed = new Subject();

  id?: number;
  term?: Term;
  notFound?: boolean;

  readonly form = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    aliases: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private termsService: TermsService
  ) {}

  ngOnInit() {
    const { route, termsService, reset, destroyed } = this;

    route.params.pipe(takeUntil(destroyed), pluck('id')).subscribe(id => {
      if (!id || isNaN(id)) {
        this.id = this.term = undefined;
        reset();
      } else {
        termsService.getTerm((this.id = Number(id))).subscribe(
          term => {
            this.notFound = false;
            this.term = term;
            reset();
          },
          () => (this.notFound = true)
        );
      }
    });
  }

  ngOnDestroy() {
    const { destroyed } = this;
    destroyed.next();
    destroyed.complete();
  }

  reset = () => {
    const { term, form } = this;
    if (term) {
      const { name, description, aliases } = term;
      form.setValue({ name, description, aliases: aliases.join('; ') });
    } else {
      form.setValue({ name: '', description: '', aliases: '' });
    }
  };

  onSubmit = () => {
    const { id, form } = this;
    if (form.invalid) {
      return;
    }
  };
}
