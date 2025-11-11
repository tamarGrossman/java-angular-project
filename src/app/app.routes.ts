import { Routes } from '@angular/router';
import { AllChallengeComponent } from './all-challenge/all-challenge.component';
import { HomeComponent } from './home/home.component';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

export const routes: Routes = [
{path:'',component:HomeComponent},
{path:'challenges',component:AllChallengeComponent },
{path:'createChallenge',component:CreateChallengeComponent},
{path:'signup',component:SignupComponent},
{path:'signin',component:SigninComponent}
];
