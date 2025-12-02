import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// הכי חשוב – הוספנו את הקומפוננטה שלנו!
import { PopularChallengesComponent } from '../popular-challenges/popular-challenges.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PopularChallengesComponent   // ← זה מה שמאפשר להשתמש ב-<app-popular-challenges>
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}