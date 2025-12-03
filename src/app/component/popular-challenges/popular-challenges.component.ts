import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChallengeService } from '../../service/challenge.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-popular-challenges',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './popular-challenges.component.html',
  styleUrls: ['./popular-challenges.component.css']
})
export class PopularChallengesComponent implements OnInit, OnDestroy {

  popularChallenges: any[] = [];
  isLoading = true;

  currentIndex = 0;
  itemsToShow = 3;
  autoPlayInterval: any = null;

  constructor(private challengeService: ChallengeService) {}

  ngOnInit(): void {
    this.updateItemsToShow();
    window.addEventListener('resize', () => this.updateItemsToShow());
    this.loadPopularChallenges();

    // אוטופליי כל 5 שניות
    this.autoPlayInterval = setInterval(() => this.next(), 5000);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.updateItemsToShow());
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
  }

loadPopularChallenges(): void {
  this.challengeService.getPopularChallenges(12).subscribe({
    next: (data: any[]) => {
      this.popularChallenges = data.map((c: any) => {
        // 🎯 הוספת בדיקה והדפסה לקונסול:
        if (c.picture && c.picture.length > 10) {
            console.log(`Challenge ${c.id}: Picture length: ${c.picture.length} (OK)`);
        } else {
            console.warn(`Challenge ${c.id}: Picture is missing or too short!`);
        }
          
        return {
          id: c.id,
          name: c.name,
          description: c.description,
          date: c.date,
          numOfDays: c.numOfDays,
          picture: c.picture, // שומרים את השדה כפי שהוא
          likeCount: c.likedByUserIds
            ? c.likedByUserIds.split(',').filter((id: string) => id.trim() !== '').length
            : 0
        };
      });
      this.isLoading = false;
    },
    error: (err) => {
      console.error('שגיאה בטעינת אתגרים פופולריים', err);
      this.isLoading = false;
    }
  });
}

  updateItemsToShow(): void {
    if (window.innerWidth < 600) this.itemsToShow = 1;
    else if (window.innerWidth < 1000) this.itemsToShow = 2;
    else this.itemsToShow = 3;
  }

  // ← הפונקציות החדשות שהיו חסרות!
  maxIndex(): number {
    return Math.max(0, this.popularChallenges.length - this.itemsToShow);
  }

  emptySlides(): number[] {
    if (this.popularChallenges.length === 0) return [];
    const remainder = this.popularChallenges.length % this.itemsToShow;
    if (remainder === 0) return [];
    return Array(this.itemsToShow - remainder).fill(0);
  }

  getDots(): number[] {
    if (this.popularChallenges.length === 0) return [];
    const totalSlides = Math.ceil(this.popularChallenges.length / this.itemsToShow);
    return Array(totalSlides).fill(0).map((_, i) => i);
  }
  // ← סוף הפונקציות

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.maxIndex();
    }
  }

  next(): void {
    if (this.currentIndex < this.maxIndex()) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }
}