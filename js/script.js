(function () {
    const hero = document.querySelector('.js-title');
    let i = 0;

    function typeEffect () {
       setTimeout(function () {
          hero.style.top = `-${i}px`;
          i = i + 45;
          if (i < 7425) { //based on the max height of the sprite
             typeEffect();
          }
       }, 25)
    }

    document.addEventListener('click', typeEffect);

})();
