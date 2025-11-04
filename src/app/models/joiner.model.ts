import { Challenge } from "./challenge.model";
import { Users } from "./users.model";

export interface joiner {
    id: number;
    startDate: Date;
    endDate: Date;

    user:Users;
    challenge:Challenge;
   
}