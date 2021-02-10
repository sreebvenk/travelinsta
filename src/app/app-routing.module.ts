import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPostComponent } from './pages/add-post/add-post.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => {redirectUnauthorizedTo(['signin'])};
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
{
  path: 'signin',
  component: SignInComponent,
  canActivate: [AngularFireAuthGuard],
  data: {authGuardPipe: redirectLoggedInToHome}
},
{
  path: 'signup',
  component: SignUpComponent,
  canActivate: [AngularFireAuthGuard],
  data: {authGuardPipe: redirectLoggedInToHome}
},
{
  path: 'addpost',
  component: AddPostComponent,
  canActivate: [AngularFireAuthGuard],
 // data: {authGuardPipe: redirectUnauthorizedToLogin}
},
{
  path: '',
  component: HomeComponent,
  canActivate: [AngularFireAuthGuard],
 // data: {authGuardPipe: redirectUnauthorizedToLogin}
},
{
  path: '**',
  component: PageNotFoundComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
