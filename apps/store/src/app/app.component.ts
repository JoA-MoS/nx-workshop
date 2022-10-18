import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { formatRating } from '@bg-hoard/store/util-formatters';
import { Game } from '@bg-hoard/util-interface';

@Component({
  selector: 'bg-hoard-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  formatRating = formatRating;
  title = 'Board Game Hoard';
  games = this.http.get<Game[]>(`${this.baseUrl}/api/games`);
  constructor(
    private http: HttpClient,
    @Inject('baseUrl') private baseUrl: string
  ) {}
}
