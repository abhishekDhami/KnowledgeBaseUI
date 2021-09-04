import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class KnowledgeHomeService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private route: Router) {}

  //Fetch list of category for current user
  getCategories() {
    return this.http.get(`${this.apiUrl}/getcategories/`).toPromise();
  }

  //Fetch list of Files for selected category for current user
  getFiles(category: string) {
    return this.http.get(`${this.apiUrl}/getfiles/${category}`).toPromise();
  }

  //Add Category to User's Content list
  addCategory(newcategory: string) {
    let option = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http.post(
      `${this.apiUrl}/addcategory`,
      { newCategory: newcategory },
      { headers: option }
    );
  }

  //Add/upload file to selected category for current user
  addFile(formdata: FormData, category: string) {
    return this.http.post(`${this.apiUrl}/uploadfile/${category}`, formdata);
  }

  //Get filedata for particular category and file
  getFile(filename: string, category: string) {
    return this.http.get(`${this.apiUrl}/getfile/${category}/${filename}`, {
      responseType: 'blob',
    });
  }
}
