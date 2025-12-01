import { Routes } from '@angular/router';
import { AllChallengeComponent } from '../app/component/all-challenge/all-challenge.component';
import { HomeComponent } from './component/home/home.component';
import { CreateChallengeComponent } from './component/create-challenge/create-challenge.component';
import { SignupComponent } from '../app/component/signup/signup.component';
import { SigninComponent } from './component/signin/signin.component';
import { SignoutComponent } from './component/signout/signout.component';
import { NavComponent } from './component/nav/nav.component';
import { ChallengeDetailsComponent } from './component/challenge-details/challenge-details.component';
import { AddCommentComponent } from './component/add-comment/add-comment.component';
import { ChatAIComponent } from './component/chat-ai/chat-ai.component';
import { UserCommentsComponent } from './component/user-comments/user-comments.component';
import { UploadedChallengesComponent } from './component/uploaded-challenges/uploaded-challenges.component';
import { JoinedChallengesComponent } from './component/joined-challenges/joined-challenges.component';
import { ProfileComponent } from './component/profile/profile.component';
import { ChallengeLikeComponent } from './component/challenge-like/challenge-like.component';
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
{path:'chatAI',component:ChatAIComponent},
{ path: 'created-challenges/:userId', component: UploadedChallengesComponent },
{ path: 'joined-challenges/:userId', component: JoinedChallengesComponent },
{ path: 'user-comments/:userId', component: UserCommentsComponent },
{path:'profile',component:ProfileComponent},
{path:'like',component:ChallengeLikeComponent}
];