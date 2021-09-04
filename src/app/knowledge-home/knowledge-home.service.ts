import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserauthService } from '../services/userauth.service';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeHomeService {
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private route: Router,
    private userAuthService: UserauthService
  ) {}

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
    return this.http
      .post(
        `${this.apiUrl}/addcategory`,
        { newCategory: newcategory },
        { headers: option }
      )
      .toPromise();
  }

  //Add/upload file to selected category for current user
  addFile(formdata: FormData, category: string) {
    return this.http
      .post(`${this.apiUrl}/uploadfile/${category}`, formdata)
      .toPromise();
  }

  createFile(fileName: string, fileText: string, category: string) {
    let option = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http
      .post(
        `${this.apiUrl}/createfile/${category}`,
        { filename: fileName, filetext: fileText },
        { headers: option }
      )
      .toPromise();
  }

  //Get filedata for particular category and file
  getFile(filename: string, category: string) {
    return this.http
      .get(`${this.apiUrl}/getfile/${category}/${filename}`, {
        responseType: 'blob',
      })
      .toPromise();
  }

  //Handling Error, If got 401 code then redirecting to Login page
  handleError(err: any) {
    if (err.error?.msg) return err.error.msg;
    if (err.status === 401) {
      this.userAuthService.removeSession();
      this.route.navigateByUrl('/login');
      return '';
    }
    if (err.statusText) return `${err.statusText}. Try After some Time`;
    if (err.message) return err.message;
    return 'Some Error Occured';
  }
}
