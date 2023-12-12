import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  slides: any[] = new Array(2).fill({id: -1, src: '', title: '', subtitle: ''});

  constructor() {
  }

  ngOnInit(): void {
    this.slides[0] = {
      id: 0,
      src: 'https://w0.peakpx.com/wallpaper/421/437/HD-wallpaper-plain-purple-background-purple.jpg',
      title: 'First slide',
      subtitle: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
    };
    this.slides[1] = {
      id: 1,
      src: 'https://res.cloudinary.com/practicaldev/image/fetch/s--kVDe1E4S--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://imgur.com/GnzKe6A.png',
      title: 'Second slide',
      subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
  }
}
