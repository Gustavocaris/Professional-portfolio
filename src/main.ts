import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './styles/content.css';
import './styles/about.css';
import './styles/projects.css';
import './styles/contentanime.css';
import './styles/carrossel.css';
import './styles/linhatemp.css';
import './styles/contact.css';
import './styles/responsive.css';

const menuhamburguer = document.querySelector<HTMLButtonElement>('.menu-hamburguer');
const nav = document.querySelector<HTMLElement>('.navbar');
const links = document.querySelectorAll<HTMLAnchorElement>('.navbar-links li a');
const header = document.getElementById('header');

function getSlidesPerView(): number {
  const width = window.innerWidth || document.documentElement.clientWidth;

  if (width < 700) {
    return 1;
  }

  if (width < 1001) {
    return 2;
  }

  return 3;
}

function createSwiper(container: HTMLElement): Swiper {
  return new Swiper(container, {
    modules: [Navigation, Pagination],
    slidesPerView: getSlidesPerView(),
    spaceBetween: 30,
    pagination: {
      el: container.querySelector<HTMLElement>('.swiper-pagination'),
      clickable: true,
    },
    navigation: {
      nextEl: container.querySelector<HTMLElement>('.swiper-button-next'),
      prevEl: container.querySelector<HTMLElement>('.swiper-button-prev'),
    },
  });
}

const swipers = Array.from(document.querySelectorAll<HTMLElement>('.mySwiper'), createSwiper);

menuhamburguer?.addEventListener('click', () => {
  nav?.classList.toggle('active');
});

links.forEach((item) => {
  item.addEventListener('click', () => {
    nav?.classList.toggle('active');
  });
});

window.addEventListener('resize', () => {
  const slidesPerView = getSlidesPerView();

  swipers.forEach((swiper) => {
    swiper.params.slidesPerView = slidesPerView;
    swiper.update();
  });
});

window.addEventListener('scroll', () => {
  if (!header) {
    return;
  }

  header.style.background = window.scrollY >= 200 ? '#191919' : 'transparent';
});
