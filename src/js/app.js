// menu
const buttons = document.querySelectorAll('.catalogBtn');
buttons.forEach(function(button) {
  const content = button.querySelector('.navCatalogContent');
  button.addEventListener('click', function() {
    if (content.style.display === 'none' || content.style.display === ''){
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  });
});
document.addEventListener('click', function(event) {
  buttons.forEach(function(button) {
    const content = button.querySelector('.navCatalogContent');
    if (!content.contains(event.target) && event.target !== button) {
      content.style.display = 'none';
    }
  });
});

const burger = document.querySelector('#burgerMenu');
burger.addEventListener('click', function(){
  const burgerContent = document.querySelector('#modalMobile');
  if (burgerContent.style.display === 'none'){
    burgerContent.style.display = 'block';
  } else {
    burgerContent.style.display = 'none';
  }
}) 

// slider 
const slider = document.querySelector('.slider');
if (slider) {
  const slides = document.querySelector('.slides');
  const slideElements = document.querySelectorAll('.slide');
  let currentIndex = 0;
  const slideCount = slideElements.length;
  const slideInterval = 5000;
  function showSlide(index) {
    
    const offset = -index * 100;
    slides.style.transform = `translateX(${offset}%)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    showSlide(currentIndex);
  }

  setInterval(nextSlide, slideInterval);
};