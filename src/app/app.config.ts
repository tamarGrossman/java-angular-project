/*import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
  
};*/
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// ייבוא רכיבי HTTP הדרושים לרישום Interceptor
import { 
  provideHttpClient, 
  withFetch, 
  HTTP_INTERCEPTORS, 
  withInterceptorsFromDi // <--- חיוני לרישום Interceptors קלאסיים
} from '@angular/common/http'; 

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpRequestInterceptor } from '../app/HttpRequestInterceptor';

// 1. ייבוא המחלקה של ה-Interceptor
// הנחתי שהקובץ נמצא בנתיב היחסי './http-request.interceptor'



export const appConfig: ApplicationConfig = {

  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // תיקון קריטי לשגיאת NG0201 (הניתוב)
    provideRouter(routes), 
    
    provideClientHydration(withEventReplay()),
    
    // 2. עדכון provideHttpClient כדי שיכלול תמיכה ב-Interceptors
    // ושימוש ב-HTTP_INTERCEPTORS כדי לרשום את המחלקה
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi() // הפעלת תמיכה ברישום Interceptor מבוסס DI
    ),
    
    // 3. רישום ה-Interceptor בפועל
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }, 
  ]
};
