export interface Challenge {
     id?:number;
      userId?:number; // או long אם תמיד חייב להיות ערך
      userName:string;
      name:string;
      description:string;
      date:Date;//תאריך העלאת האתגר
      numOfDays:number;//משך האתגר בימים
      picture?:string;
      imagePath?:string;
    }