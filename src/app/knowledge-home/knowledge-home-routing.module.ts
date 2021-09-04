import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeContentFilesComponent } from './knowledge-content-files/knowledge-content-files.component';
import { KnowledgeContentComponent } from './knowledge-content/knowledge-content.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'content' },
  { path: 'profile', component: ProfileComponent },
  { path: 'content', component: KnowledgeContentComponent },
  { path: 'files/:category', component: KnowledgeContentFilesComponent },
  { path: '**', redirectTo: 'content' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeHomeRoutingModule {}
