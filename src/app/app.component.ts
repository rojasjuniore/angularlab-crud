import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from "./services/api.service";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  uinames: IUinames;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  user: any = {}
  constructor(public _apiService: ApiService, public db: AngularFireDatabase) {
    this.uinames = {
      name: '',
      surname: '',
      gender: '',
      region: '',
      age: 0,
      title: '',
      phone: '',
      birthday: {
        dmy: '',
        mdy: '',
        raw: 0
      },
      email: '',
      password: '',
      photo: ''
    }
    this.itemsRef = db.list('users');
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.petition();

  }

  petition() {
    this._apiService.getUinames()
      .subscribe((data: any) => {
        this.user.img = data.photo;
        this.user.name = data.name, ' - ', data.surname;
        this.user.email = data.email;
        this.user.tlf = data.phone;
      }, err => console.log(err));
  }


  updateItem(key: string, newText: string) {

    const user_ = {
      img: this.user.img || 'https://www.tuexperto.com/wp-content/uploads/2015/07/perfil_01.jpg',
      name: this.user.name,
      email: this.user.email,
      tlf: this.user.tlf
    }
    this.itemsRef.update(key, user_);
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }

  onSubmit(f: NgForm) {
    const user_ = {
      img: this.user.img || 'https://www.tuexperto.com/wp-content/uploads/2015/07/perfil_01.jpg',
      name: this.user.name,
      email: this.user.email,
      tlf: this.user.tlf
    }
    const itemsRef: any = this.db.list('users');
    itemsRef.push(user_);
  }
}

export interface IUinames {
  name: string;
  surname: string;
  gender: string
  region: string,
  age: number,
  title: string,
  phone: string,
  birthday: {
    dmy: string
    mdy: string
    raw: number
  },
  email: string,
  password: string
  credit_card?: {
    expiration: string,
    number: string,
    pin: string,
    security: string
  },
  photo: string
}

