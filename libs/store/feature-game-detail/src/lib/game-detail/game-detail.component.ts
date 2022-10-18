import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { formatRating } from '@bg-hoard/store/util-formatters';
import { Game } from '@bg-hoard/util-interface';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'bg-hoard-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css'],
})
export class GameDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject('baseUrl') private baseUrl: string
  ) {}

  game$ = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('id')),
    switchMap((id) => this.http.get<Game>(`${this.baseUrl}/api/games/${id}`))
  );
  formatRating = formatRating;
}
