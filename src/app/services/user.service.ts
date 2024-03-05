import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {User} from "../models";
import {HttpClient} from "@angular/common/http";

interface ResponseData {
  [key: string]: User;
}

@Injectable({
  providedIn: 'root' // This makes AuthService available throughout the application
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<ResponseData>('https://foxy-fit-default-rtdb.europe-west1.firebasedatabase.app//users.json').pipe(
      map((responseData: ResponseData) => {
          const users: User[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              users.push({...responseData[key], id: key});
            }
          }
          return users;
        }
      )
    )
  }
}
