import throttle from 'lodash.throttle';

const btnUpRef = document.querySelector('.btn-up');

btnUpRef.addEventListener('click', () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    btnUpRef.classList.remove('is-hidden');
  } else {
    btnUpRef.classList.add('is-hidden');
  }
}

window.addEventListener('scroll', throttle(scrollFunction, 600));
