import {Component, OnInit, AfterViewInit, Input} from '@angular/core';

@Component({
  selector: 'multi-item-carousel',
  templateUrl: './multi-item-carousel.component.html',
  styleUrls: ['./multi-item-carousel.component.css']
})
export class MultiItemCarouselComponent implements OnInit{
  @Input() items: any;

  private carousel: HTMLElement | null = null;
  private carouselInner: HTMLElement | null = null;
  private currentSlide: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.carousel = document.getElementById('carousel') as HTMLElement;
  }
  //TODO: On focus
  ngAfterViewInit(): void {
    if (this.carousel) {
      this.carouselInner = this.carousel.querySelector('.custom-carousel-inner') as HTMLElement;
      this.attachEventListeners();
      this.showSlide(this.currentSlide);
    }
  }

  private attachEventListeners(): void {
    const prevButton = this.carousel!.querySelector('.carousel-control-prev') as HTMLButtonElement;
    const nextButton = this.carousel!.querySelector('.carousel-control-next') as HTMLButtonElement;

    prevButton.addEventListener('click', () => {
      this.prevSlide();
    });

    nextButton.addEventListener('click', () => {
      this.nextSlide();
    });

    this.updateButtonState(0); // Update button state initially
  }

  private updateButtonState(maxSlideIndex: number): void {
    const prevButton = this.carousel!.querySelector('.carousel-control-prev') as HTMLButtonElement;
    const nextButton = this.carousel!.querySelector('.carousel-control-next') as HTMLButtonElement;

    prevButton.disabled = this.currentSlide === 0;
    nextButton.disabled = this.currentSlide === maxSlideIndex;

    prevButton.classList.toggle('carousel-control-disabled', prevButton.disabled);
    nextButton.classList.toggle('carousel-control-disabled', nextButton.disabled);
  }

  private showSlide(slideIndex: number): void {
    if (this.carouselInner) {
      if(this.carousel!.offsetWidth % 220 !== 0){

      }else{

      }
      const slides = this.carouselInner.getElementsByClassName('custom-carousel-item');
      const slideWidth = (slides[0] as HTMLElement).offsetWidth; // Get the width of a single slide including margins

      const containerWidth = this.carousel!.offsetWidth; // Get the width of the carousel container

      const visibleSlides = Math.floor(containerWidth / slideWidth); // Calculate the number of visible slides

      const maxSlideIndex = slides.length - visibleSlides; // Calculate the maximum slide index

      slideIndex = Math.max(0, Math.min(slideIndex, maxSlideIndex)); // Clamp the slide index within the valid range

      let substractionWidth = 0;
      let translateX = -(slideIndex * slideWidth); // Calculate the translateX value

      if (slideIndex === maxSlideIndex) {
        substractionWidth = containerWidth - visibleSlides * slideWidth;
        translateX += substractionWidth;
      }

      // Debug values
      // console.log("slide width:" + slideWidth);
      // console.log("containerWidth:" + containerWidth);
      // console.log("visibleSlides:" + visibleSlides);
      // console.log("substractionWidth:" + substractionWidth);
      // console.log("maxSlideIndex:" + maxSlideIndex);
      // console.log("slideIndex:" + slideIndex);
      // console.log("translateX:" + translateX);

      this.carouselInner.style.transform = `translateX(${translateX}px)`;
      this.currentSlide = slideIndex;

      this.updateButtonState(maxSlideIndex); // Update button state after showing slide
    }
  }

  private prevSlide(): void {
    this.showSlide(this.currentSlide - 1);
  }

  private nextSlide(): void {
    this.showSlide(this.currentSlide + 1);
  }
}
