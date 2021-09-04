import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KnowledgeHomeRoutingModule } from './knowledge-home-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { KnowledgeContentComponent } from './knowledge-content/knowledge-content.component';
import { KnowledgeContentFilesComponent } from './knowledge-content-files/knowledge-content-files.component';
import { UploadfileComponent } from './uploadfile/uploadfile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    KnowledgeContentComponent,
    KnowledgeContentFilesComponent,
    UploadfileComponent,
  ],
  imports: [CommonModule, KnowledgeHomeRoutingModule],
})
export class KnowledgeHomeModule {}
