import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription, timer, fromEvent, interval, merge, EMPTY } from 'rxjs';
import {
  takeWhile,
  takeUntil,
  switchMap,
  scan,
  startWith,
  repeat,
  map,
  tap,
  filter
} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {

      subscription!: Subscription;
    everyFiveSeconds: Observable<number> = timer(0, 1);
  constructor() {

  }
  @ViewChild('gameboard', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  @ViewChild('start') start!: ElementRef<HTMLButtonElement>;
  @ViewChild('stop') stop!: ElementRef<HTMLButtonElement>;
  @ViewChild('pause') pause!: ElementRef<HTMLButtonElement>;

  counterDisplayHeader = document.querySelector('h3');

  startClick$! : Observable<any>;
  stopClick$! : Observable<any>;
  pauseBtn$! : Observable<any>;




  ngOnInit(): void {
    // this.subscription = this.everyFiveSeconds.subscribe(() => {
    //             this.drawRect();
    // });




  }



  ngAfterViewInit(): void {
          this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.width = 1000;
    this.canvas.nativeElement.height = 1000;

  this.startClick$ = fromEvent(this.start.nativeElement, 'click');
    this.stopClick$ = fromEvent(this.stop.nativeElement, 'click').pipe(tap(() => {

      this.ctx.clearRect(0, 0, 1000, 1000);
    }));
    this.pauseBtn$ = fromEvent(this.pause.nativeElement, 'click');



    console.log("pop")

        merge(
      this.startClick$.pipe(map(()=>true)),
      this.pauseBtn$.pipe(map(()=>false))
    )
      .pipe(
        switchMap(val => (val ? interval(10) : EMPTY)),
        scan((acc: number, curr: number) => acc + curr, 0),
        takeWhile(val => val >= 0),
        startWith(0),
        takeUntil(this.stopClick$),
        repeat(),
        filter(val=>val >0)
      )
      .subscribe(val => {
        this.drawRect();
      });



    }

  drawRect() {
    const c = this.ctx;
    c.beginPath();
    const randx = Math.floor(Math.random() * 81) * 10
    const randy = Math.floor(Math.random() * 81) * 10

    c.rect(randx, randy, 10, 10);
    c.fillStyle = 'black';
    c.fill();
  }
}
