import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-project',
  imports: [RouterLink],
  templateUrl: './project.html',
  styleUrls: ['./project.css'],
  host: {
    class: 'content-area flex-grow-1 d-flex flex-column gap-4'
  }
})
export class Project implements OnInit {

  @Input() projectName!: string;
  projectId!: string;

  private destroyRef = inject(DestroyRef);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    const subscription = this.activatedRoute.params.subscribe(
      {
        next: (paramMap) => {
          this.projectId = paramMap['projectId'];
        }
      }
    );

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
