import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'; // ✅ הוספת ViewChild
import { HttpErrorResponse } from '@angular/common/http'; 
import { CommentService } from '../../service/comment.service';
import { Comment } from '../../models/comment.model'; 
import { FormsModule, NgForm } from '@angular/forms'; 
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-comment',
  imports: [FormsModule,NgClass],
  standalone: true,
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})
export class AddCommentComponent {
  
  @ViewChild('commentForm') commentForm!: NgForm; 
  @Input() challengeId: number | undefined;  
  @Output() commentAdded = new EventEmitter<void>();

  commentContent: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  selectedFile: File | null = null; 

  constructor(private commentService: CommentService) { }

    handleSuccess(): void {
    this.message = '✅ התגובה נוספה בהצלחה!';

    this.isError = false;
    this.commentContent = '';
    this.selectedFile = null;
    
    this.commentForm.resetForm({ commentContent: '' }); 
    
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ''; 
    } 
    
    this.commentAdded.emit(); 
    
    setTimeout(() => {
      this.message = ''; 
      console.log('3. [ADD_COMMENT] TIMER ENDED: Hiding message after 3 seconds.');
    }, 3000); 
  }
  
 
  onFileSelected(event: any): void {
    const fileList: FileList = event.target.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
    } else {
      this.selectedFile = null;
    }
  }

  
  submitComment(): void {
    // ⭐ בדיקה קריטית: אם טופס ה-HTML אינו תקין (כלומר, ה-minlength/maxlength נכשל), עצור!
    if (this.commentForm.invalid) {
      this.isError = true;
      this.message = 'אנא תקן את השגיאות בתוכן התגובה (אורך מינימלי/מקסימלי).'; 
      return;
    }

    // בדיקת האתגר)
    if (!this.challengeId) { 
      this.isError = true;
      this.message = 'שגיאת מערכת: לא נמצא ID אתגר.'; 
      return;
    }

    this.isLoading = true;
    this.isError = false;
    this.message = ''; 

    // 1. בניית ה-FormData
    const formData = new FormData();

    // 2. הכנת ה-JSON
    const commentDataDto = {
        content: this.commentContent,
    };

    const commentBlob = new Blob([JSON.stringify(commentDataDto)], { type: 'application/json' });
    formData.append('commentData', commentBlob); 

    if (this.selectedFile) {
      // 4. הוספת הקובץ (חלק ה-"image") - רק אם קיים!
      formData.append('image', this.selectedFile, this.selectedFile.name); 
    }
    
    // קריאה לשירות
    this.commentService.addCommentToChallenge(this.challengeId, formData)
      .subscribe({
        next: (res: any) => { 
           this.handleSuccess();
        },
        error: (err: HttpErrorResponse) => { 
          const status = err.status;
          
          if (status === 201 || status === 200 || status === 0) { 
            // טיפול בשגיאת פרסור/CORS/201
            this.handleSuccess();
          
          } else {
            this.isError = true;
            const errorMessage = err.error?.message || err.message || `סטטוס: ${status}. שגיאת שרת לא ידועה.`;
            this.message = `שגיאה בשליחת התגובה: ${errorMessage}`;
          }
          if(status===403){
                          this.message = "עליך להתחבר כדי להעלות תגובה";

          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
}