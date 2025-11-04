import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Challenge } from '../models/challenge.model';
import { ChallengeService } from '../service/challenge.service';
import {  CommonModule} from '@angular/common'; // <-- צריך לייבא את הפייפ
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-all-challenge',
 imports: [HttpClientModule,CommonModule],
  standalone: true,
  templateUrl: './all-challenge.component.html',
  styleUrl: './all-challenge.component.css'
})
export class AllChallengeComponent implements OnInit{

  challengeList: Challenge[] = []; // מערך לאחסון כל האתגרים

  constructor(private challengeService: ChallengeService) { }

ngOnInit(): void {
  this.challengeService.getAllChallenges().subscribe({
    next: (res) => {
      this.challengeList = res; // שמים את כל האתגרים במערך להצגה ב-HTML
    },
    error: (err) => {
      console.error("Error fetching challenges:", err);
    }
  });
}


}
