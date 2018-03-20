import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Cat } from '../shared/models/cat.model';
import { Domain } from '../shared/models/domain.model';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CatService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  /* getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>('/api/cats');
  }

  countCats(): Observable<number> {
    return this.http.get<number>('/api/cats/count');
  }

  addCat(cat: Cat): Observable<Cat> {
    return this.http.post<Cat>('/api/cat', cat);
  }

  getCat(cat: Cat): Observable<Cat> {
    return this.http.get<Cat>(`/api/cat/${cat._id}`);
  }

  editCat(cat: Cat): Observable<string> {
    return this.http.put(`/api/cat/${cat._id}`, cat, { responseType: 'text' });
  }

  deleteCat(cat: Cat): Observable<string> {
    return this.http.delete(`/api/cat/${cat._id}`, { responseType: 'text' });
  } 
  
  
  
  Need to do all of these calls... for username password combinations and domains
  
  //get the username from the AuthService!!!!
  
  */
  
  //get arrays 
  getCombs(): Observable<Cats[]> {
    return this.http.post<Cats[]>('/api/cats', {"user": this.auth.currentUser.username});
  }
  
  getDomains(): Observable<Domain[]> {
    return this.http.post<Domain[]>('/api/domains', {"user": this.auth.currentUser.username});
  }
  
  //add single comb and domain 
  addComb(cat: Cats): Observable<Cats> {
	  cat.user = this.auth.currentUser.username;
    return this.http.post<Cat>('/api/cat/insert', cat);
  }
  
  addDomain(domain: Domain): Observable<Domain> {
	  domain.user = this.auth.currentUser.username;
    return this.http.post<Domain>('/api/domains/insert', domain);
  }
  
  
  //get single comb and domain 
  getComb(cat: Cats): Observable<Cats> {
    return this.http.get<Cats>(`/api/cat/get/${cat._id}`);
  }
  
  getDomain(domain: Domain): Observable<Domain> {
    return this.http.get<Domain>(`/api/domains/get/${domain._id}`);
  }
  
  
  //delete single comb and domain 
  deleteComb(cat: Cats): Observable<string> {
    return this.http.delete(`/api/cat/delete/${cat._id}`, { responseType: 'text' });
  }
  
  deleteDomain(domain: Domain): Observable<string> {
    return this.http.delete(`/api/domains/delete/${domain._id}`, {params: {user: domain.user, catdomain: domain.domainname}, responseType: 'text'});
  }
  
}
