import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Share } from '../shared/models/share.model';
import { Cat } from '../shared/models/cat.model';
import { Domain } from '../shared/models/domain.model';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ShareService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  
  getShares(): Observable<Share[]> {
    return this.http.post<Share[]>('/api/shares', {"user": this.auth.currentUser.username});
  }
  
  
  addShare(share: Share): Observable<Share> {
	  share.user = this.auth.currentUser.username;
    return this.http.post<Share>('/api/share', share); 
  }
  
  editShare(share: Share): Observable<string> {
    return this.http.put(`/api/share/${share._id}`, share, { responseType: 'text' });
  }
  
  deleteShare(share: Share): Observable<string> {
    return this.http.delete(`/api/share/${share._id}`, { responseType: 'text' });
  }
  
  //used weather.service.ts as reference
  getCurrentValue(id: String) {
	  var endpoint = "/api/share/value/" + id;
	  console.log(endpoint);
	  
	  return this.http.get<String>(endpoint);
  }
  
}
