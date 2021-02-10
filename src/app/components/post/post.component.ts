import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { faThumbsUp, faThumbsDown, faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges {

  @Input()
  post;

  faThumbsUP = faThumbsUp;
  faThumbsDown = faThumbsDown;
  faShareSquare = faShareSquare;

  uid = null;

  upVote = 0;
  downVote = 0;

  constructor(
    private db: AngularFireDatabase,
    private auth: AuthService
  ) {
    this.auth.getUser().subscribe((user) => {
      this.uid = user?.uid;
    });
  }

  ngOnInit(): void {
  }

  //todo bug in updating the changes

  ngOnChanges(): void{
    if(this.post.vote){
      Object.values(this.post.vote).map((val: any) => {
        if(val.upVote){
          this.upVote +=1
        }
        if(val.downVote){
          this.downVote += 1
        }
      })
    }
  }

  upVotePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upVote: 1
    })
  }

  downVotePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downVote: 1
    })
  };

  getInstaUrl(){
    return `https://instagram.com/${this.post.instaId}`
  };

}
