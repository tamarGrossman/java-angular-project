
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  CommonModule} from '@angular/common'; 
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  popularChallenges = [
    { title: 'אתגר ריצה 5 ק״מ', description: 'אתגר לשפר כושר אירובי.' },
    { title: 'אתגר כוח', description: 'חיזוק כל הגוף עם תרגילים פשוטים בבית.' },
    { title: 'אתגר בריאות', description: 'הרגלי תזונה ובריאות שבועיים.' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

}
