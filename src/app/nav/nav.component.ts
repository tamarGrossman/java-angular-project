import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; // 💡 ייבוא חובה ל-routerLink


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  ngOnInit(): void {
  }
}
