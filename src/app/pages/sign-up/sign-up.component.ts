import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { finalize } from 'rxjs/operators';

// fireBase
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

// browser img resizer
import { readAndCompressImage } from 'browser-image-resizer';
import { imageConfig } from 'src/utils/config';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  picture: string = "https://image.shutterstock.com/image-vector/cartoon-floating-guru-vector-clip-600w-116465911.jpg";
  uploadPercent: number

  constructor(
    private auth: AuthService,
    private router: Router,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm){
    const {email, password, username, country, bio, name} = f.form.value;

    this.auth.signUp(email, password)
    .then((res) => {
      console.log('response', res.user)
      const {uid} = res.user;
      this.db.object(`/users/${uid}`)
      .set({
        id: uid,
        name: name,
        email: email,
        instaUserName: username,
        country: country,
        bio: bio,
        picture: this.picture
      })
    })
    .then(() => {
    this.router.navigateByUrl('/');
    this.toastr.success('signUp success', '', {closeButton: true});
  })
    .catch((err) => {
      this.toastr.error('signUp failed', '', {closeButton: true});
    })
  }

  async uploadFile(event){
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, imageConfig);

    const filePath = file.name  // rename the image with Todo uid
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });

    task.snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success('image upload success', '', {closeButton: true})
        })
      })
    ).subscribe()
  }

}
