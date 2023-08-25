import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {

      subscription!: Subscription;
    everyFiveSeconds: Observable<number> = timer(0, 500);
  constructor() {

  }
  @ViewChild('gameboard', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

    private ctx!: CanvasRenderingContext2D;
  ngOnInit(): void {
this.subscription = this.everyFiveSeconds.subscribe(() => {
             this.drawRect();
       });
  }

  ngAfterViewInit(): void {
          this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.width = 800;
    this.canvas.nativeElement.height = 800;
    console.log("pop")
    this.drawRect();

    }

  drawRect() {
    const c = this.ctx;
    c.beginPath();
    const randx = Math.floor(Math.random() * 11) * 10
    const randy = Math.floor(Math.random() * 11) * 10

    c.rect(randx, randy, 10, 10);
    c.fillStyle = 'black';
    c.fill();
  }
}
