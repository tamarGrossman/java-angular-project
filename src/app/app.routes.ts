import { Routes } from '@angular/router';
import { AllChallengeComponent } from './all-challenge/all-challenge.component';
import { HomeComponent } from './home/home.component';
import { CreateChallengeComponent } from './create-challenge/create-challenge.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';
import { NavComponent } from './nav/nav.component';
import { ChallengeDetailsComponent } from './challenge-details/challenge-details.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { ChatAIComponent } from './chat-ai/chat-ai.component';
export const routes: Routes = [
{path:'',component:HomeComponent},
{path:'challenges',component:AllChallengeComponent },
{path:'createChallenge',component:CreateChallengeComponent},
{path:'signup',component:SignupComponent},
{path:'signin',component:SigninComponent},
{path:'signout',component:SignoutComponent},
{path:'nav',component:NavComponent},
{path:'challenge/:id',component:ChallengeDetailsComponent},
{path:'addComment',component:AddCommentComponent},
{path:'chatAI',component:ChatAIComponent}];