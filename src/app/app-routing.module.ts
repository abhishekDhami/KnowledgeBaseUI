import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserloginComponent } from './userlogin/userlogin.component';
import { AuthGuard } from './auth-guard.guard';

const routes: Routes = [
  { path: 'login', component: UserloginComponent },
  {
    path: 'knowledgehome',
    loadChildren: () =>
      import('./knowledge-home/knowledge-home.module').then(
        (m) => m.KnowledgeHomeModule
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
