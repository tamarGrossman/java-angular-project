import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './component/nav/nav.component';
import { CommonModule } from '@angular/common';
import { ChatAIComponent } from './component/chat-ai/chat-ai.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,RouterOutlet,CommonModule,ChatAIComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { 
  title = 'challenge';
  
  isChatOpen: boolean = true; 

  private hasUserClosed: boolean = false;

  ngOnInit(): void {
   
  }
  
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    this.hasUserClosed = true;
  }
  
  closeChatWindow(): void {
    this.isChatOpen = false;
    this.hasUserClosed = true; 
}
}