import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Observable,
  Subscription,
  timer,
  fromEvent,
  interval,
  merge,
  EMPTY,
} from 'rxjs';
import {
  takeWhile,
  takeUntil,
  switchMap,
  scan,
  startWith,
  repeat,
  map,
  tap,
  filter,
} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnInit {
  subscription!: Subscription;
  everyFiveSeconds: Observable<number> = timer(0, 1);
  constructor() {}
  @ViewChild('gameboard', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  public state!: number[][];

  @ViewChild('start') start!: ElementRef<HTMLButtonElement>;
  @ViewChild('stop') stop!: ElementRef<HTMLButtonElement>;
  @ViewChild('pause') pause!: ElementRef<HTMLButtonElement>;

  counterDisplayHeader = document.querySelector('h3');

  startClick$!: Observable<any>;
  stopClick$!: Observable<any>;
  pauseBtn$!: Observable<any>;

  ngOnInit(): void {
    // this.subscription = this.everyFiveSeconds.subscribe(() => {
    //             this.drawRect();
    // });
    this.reset();
    // this.state[20][20] = 1;
    // this.state[20][19] = 1;
    // this.state[20][20] = 1;
    // this.state[21][20] = 1;
    // this.state[20][21] = 1;
    // this.state[21][21] = 1;
  }

  reset() {
    this.state = [];
    for (var i = 0; i < 80; i++) {
      this.state[i] = new Array(80).fill(0);
    }
    this.state[20][20] = 1;
    this.state[21][20] = 1;
    this.state[22][20] = 1;
    this.state[23][20] = 1;
    this.state[24][20] = 1;
    this.state[25][20] = 1;

    // this.state[20][21] = 1;
    this.state[21][21] = 1;
    // this.state[11][21] = 1;
    // this.state[23][21] = 1;
    // this.state[24][21] = 1;
    // this.state[25][21] = 1;


  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.width = 800;
    this.canvas.nativeElement.height = 800;

    this.startClick$ = fromEvent(this.start.nativeElement, 'click');
    this.stopClick$ = fromEvent(this.stop.nativeElement, 'click').pipe(
      tap(() => {
        this.ctx.clearRect(0, 0, 800, 800);
        this.reset();
                for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 80; y++) {
        const c = this.ctx;
        c.beginPath();
        const pointx = x * 10;
        const pointy = y * 10;

        c.rect(pointx, pointy, 10, 10);
        c.fillStyle = this.state[x][y] == 1 ? 'black' : 'white';
                c.strokeStyle = 'grey';
        c.stroke();
        c.lineWidth = 2;
        c.fill();
      }
    }
      })
    );
    this.pauseBtn$ = fromEvent(this.pause.nativeElement, 'click');

    console.log('pop');

    merge(
      this.startClick$.pipe(map(() => true)),
      this.pauseBtn$.pipe(map(() => false))
    )
      .pipe(
        switchMap((val) => (val ? interval(1000) : EMPTY)),
        scan((acc: number, curr: number) => acc + curr, 0),
        takeWhile((val) => val >= 0),
        startWith(0),
        takeUntil(this.stopClick$),
        repeat(),
        filter((val) => val > 0)
      )
      .subscribe((val) => {
        this.drawRect();
      });

        for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 80; y++) {
        const c = this.ctx;
        c.beginPath();
        const pointx = x * 10;
        const pointy = y * 10;

        c.rect(pointx, pointy, 10, 10);
        c.fillStyle = this.state[x][y] == 1 ? 'black' : 'white';
                c.strokeStyle = 'grey';
        c.stroke();
        c.lineWidth = 2;
        c.fill();
      }
    }
  }

  plus1(val: number) {
    if (val < 80) return val;
    return 80;
  }
  drawRect() {
    let tempstate = [];

    for (var i = 0; i < 80; i++) {
      tempstate[i] = new Array(80).fill(0);
    }

    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 80; y++) {
        let neighbourcount = 0;

        if (y < 79 && x > 0 && this.state[x - 1][y + 1] == 1) neighbourcount++;
        if (y < 79 && this.state[x][y + 1] == 1) neighbourcount++;
        if (y < 79 && x < 79 && this.state[x + 1][y + 1] == 1) neighbourcount++;
        if (x > 0 && this.state[x - 1][y] == 1) neighbourcount++;
        if (x < 79 && this.state[x + 1][y] == 1) neighbourcount++;
        if (x > 0 && y > 0 && this.state[x - 1][y - 1] == 1) neighbourcount++;
        if (y > 0 && this.state[x][y - 1] == 1) neighbourcount++;

        if (neighbourcount < 2) tempstate[x][y] = 0;
        if (neighbourcount > 3) tempstate[x][y] = 0;
        if (neighbourcount == 2 || neighbourcount == 3) tempstate[x][y] = this.state[x][y];
        if (neighbourcount == 3) tempstate[x][y] = 1;
      }
    }

    for (let x = 0; x < 80; x++) {
      for (let y = 0; y < 80; y++) {
        const c = this.ctx;
        c.beginPath();
        const pointx = x * 10;
        const pointy = y * 10;

        c.rect(pointx, pointy, 10, 10);
        c.fillStyle = tempstate[x][y] == 1 ? 'black' : 'white';
        c.strokeStyle = 'grey';
        c.stroke();
        c.lineWidth = 2;
        c.fill();
      }
    }
    this.state = tempstate;
  }
}
