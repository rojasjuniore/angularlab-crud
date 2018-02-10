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
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

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

  addItem(newName: string) {
    this.itemsRef.push({ text: newName });
  }
  updateItem(key: string, newText: string) {
    const user_ = {
      img: this.user.img,
      name: this.user.name,
      email: this.user.email,
      tlf: this.user.tlf,
      key_: this.user.key
    }
    this.itemsRef.update(user_.key_, user_);
  }
  deleteItem(key: string) {
    this.itemsRef.remove(key);
  }
  deleteEverything() {
    this.itemsRef.remove();
  }
  onSubmit(f: NgForm) {
    const user_ = {
      img: this.user.img,
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

