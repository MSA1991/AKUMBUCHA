'use strict';

const body = document.body;
const burger = document.getElementById('burger');
const menu = document.querySelector('.menu');
const links = document.querySelectorAll('a');
const navLinkMenu = document.querySelectorAll('.nav__link--menu');
const animItems = document.querySelectorAll('.anim');

burger.addEventListener('change', () => {
  menu.classList.toggle('menu--open');
  body.classList.toggle('page__body--overflow');

  navLinkMenu.forEach((link, i) => {
    if (link.classList.contains('nav__link--menu-active')) {
      link.classList.remove('nav__link--menu-active');
    } else {
      setTimeout(() => {
        link.classList.toggle('nav__link--menu-active');
      }, 200 * i);
    }
  });
});

links.forEach(link => {
  link.addEventListener('click', () => {
    if (burger.checked) {
      menu.classList.remove('menu--open');
      body.classList.remove('page__body--overflow');
      burger.checked = false;

      navLinkMenu.forEach(navLink => {
        navLink.classList.remove('nav__link--menu-active');
      });
    }
  });
});

// eslint-disable-next-line no-undef
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('anim--active');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

animItems.forEach(item => {
  observer.observe(item);
});
