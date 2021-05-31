(function(){

  // -- vars
  var body              = document.body,
      html              = document.documentElement,
      linkVideo         = document.querySelector('.video-pupup'),
      linkYaGeroy       = document.querySelector('.js-popup-ya-geroy'),
      payPopup          = document.querySelector('.js-pay-pupup'),
      mobMenu           = document.querySelector('.menu-mob-left'),
      layout            = document.querySelector('.layout'),
      btnCloseMobMenu   = document.querySelector('.menu-mob-left__ico-close'),
      stickyWrap        = document.querySelector('.layout__menu'),
      dateInput         = document.querySelectorAll('.input__field--date'),
      entryPriceTable   = document.querySelector('.promo-table-wrap'),
      profileMDropDown  = document.querySelector('.h-profile'),
      btnTaskDone       = document.querySelector('.btn-task'),
      task              = document.querySelector('.task__item'),
      isMobile          = Modernizr.mq('(max-width: 1024px)');

  // --  inject svg sprite
  SVGInjector(document.getElementById('svg-inject-me'));
  SVGInjector(document.getElementById('svg-inject-me2'));

  // -- http://nosir.github.io/cleave.js/

  if (!(dateInput === null)) {
    dateInput.forEach(function(el, i){
      new Cleave(el, {
          date: true,
          datePattern: ['d', 'm', 'Y']
      });
    });
  }

  // -- http://github.hubspot.com/offline/

  // --  Sticky Menu
  function stickyMenu() {
    var stickElContainer = document.querySelector('.layout__menu'),
        stickElContainerHeight = stickElContainer.clientHeight,
        docHeight = window.innerHeight,
        stickEl = document.querySelector('.layout__menu-inner'),
        stickyElTop = stickEl.offsetTop;

    var sticky = function(){
      var scrollTop = window.scrollY;
      if ( (stickyElTop + 60) < scrollTop && smallDisplay()) {
        stickEl.classList.add('is-fixed');
      } else {
        stickEl.classList.remove('is-fixed');
      }
    };

    var smallDisplay = function() {
      var isTooSmallDisplay = docHeight - stickElContainerHeight - 100;

      if (isTooSmallDisplay > 0) {
        return true;
      } else {
        return false;
      }
    }

    var calcSideBarWidth = function() {
      stickyWrapWidth = stickyWrap.clientWidth;
      stickEl.style.width = stickyWrapWidth;
    };

    calcSideBarWidth();

    document.addEventListener('scroll', sticky, false);
    window.addEventListener('resize', calcSideBarWidth, false);
  }

  if (!(stickyWrap === null) && !isMobile) {stickyMenu();}

  // -- Float Labels
  // document.addEventListener('keyup', function(e) {
  //   if (e.target.classList.contains('input__field')) {
  //     var val = e.target.value,
  //         el = e.target.parentNode;
  //     if (!el.classList.contains('float-label')) {
  //       el.classList.add('float-label');
  //     } else if (!val.length > 0) {
  //       el.classList.remove('float-label');
  //     }
  //   }
  // }, false);

  // -- Burger Menu
  function burger(e) {
    if ( findMeorAncestor(e.target, 'header__ico-burger') ) {
      if (!layout.classList.contains('mob-menu-active')) {
        layout.classList.add('mob-menu-active');
      } else {
        layout.classList.remove('mob-menu-active');
      }
    }
  }

  function burgerClose(e) {
    if ( findMeorAncestor(e.target, 'menu-mob-left') ) {
      layout.classList.remove('mob-menu-active');
    }
  }

  document.addEventListener('click', burger, false);
  if (!(btnCloseMobMenu === null)) btnCloseMobMenu.addEventListener('click', burgerClose, false);

  // -- Accordion
  document.addEventListener('click', function(e) {
    if (findMeorAncestor(e.target,'accordion__header')) {
      var item = closest(e.target, 'accordion__item')
      if (!item.classList.contains('accordion__item--active')) {
        item.classList.add('accordion__item--active');
      } else {
        item.classList.remove('accordion__item--active');
      }
      e.preventDefault();
    }
  }, false);

  // --
  // DEMO
  // --

  // --  http://robinparisi.github.io/tingle/

  function lockScreen() {
    html.classList.add('lock-screen');
    body.classList.add('lock-screen');
  }

  function unLockScreen() {
    html.classList.remove('lock-screen');
    body.classList.remove('lock-screen');
  }

  var popup = new tingle.modal({
    footer: false,
    stickyFooter: false,
    cssClass: ['base-popup'],
    onOpen: function() {
      // for mobile
      lockScreen();

    },
    onClose: function() {
      // for mobile
      unLockScreen();
    }
  });

  var videoPopup = new tingle.modal({
    footer: false,
    stickyFooter: false,
    cssClass: ['video-popup'],
    onOpen: function() {lockScreen();},
    onClose: function() {unLockScreen();}
  });

  var mobPopup = new tingle.modal({
    footer: false,
    stickyFooter: false,
    cssClass: ['mob-popup'],
    onOpen: function() {lockScreen();},
    onClose: function() {unLockScreen();}
  });

  if (!(linkVideo === null)) {
    linkVideo.addEventListener('click', function(e){
      e.preventDefault();
      videoPopup.open();
      videoPopup.setContent('<iframe width="100%" height="100%" src="https://www.youtube.com/embed/E3Wq9YxqTI4" frameborder="0" allowfullscreen></iframe>');
    }, false);
  }

  if (!(linkYaGeroy === null)) {
    linkYaGeroy.addEventListener('click', function(e){
      e.preventDefault();
      mobPopup.open();
      mobPopup.setContent(document.querySelector('.entry-info__inner').innerHTML);
    }, false);
  }

  if (!(payPopup === null)) {
    payPopup.addEventListener('click', function(e){
      e.preventDefault();
      popup.open();
      popup.setContent(document.querySelector('pay-success').innerHTML);
    }, false);
  }

  // -- Complete Task
  document.addEventListener('click', function(e) {
    if (findMeorAncestor(e.target, 'btn-task')) {
      if (!btnTaskDone.classList.contains('btn-task--done')) {
        btnTaskDone.classList.add('btn-task--done');
      } else {
        btnTaskDone.classList.remove('btn-task--done');
      }
      e.preventDefault();
    }
  }, false);


  // -- Entry - Open Promo
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('js-entry-toggle-promo')) {
      if (!entryPriceTable.classList.contains('is-open')) {
        entryPriceTable.classList.add('is-open');
      } else {
        entryPriceTable.classList.remove('is-open');
      }
      e.preventDefault();
    }
  }, false);

  // -- Profile menu
  document.addEventListener('click', function(e) {
    if (findMeorAncestor(e.target, 'h-profile')) {
      if (!profileMDropDown.classList.contains('is-open')) {
        profileMDropDown.classList.add('is-open');
      } else {
        profileMDropDown.classList.remove('is-open');
      }
      e.preventDefault();
    }
  }, false);

  // -- Layout navigation
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('layout-nav')) {
      var val = e.target.options[e.target.selectedIndex].value,
          url = window.location.protocol + '//' + window.location.host + val;
      window.location.href = url;
    }
  }, false);


  // -- Helpers
  function closest(el, cls) {
    while ( (el = el.parentElement) && !el.classList.contains(cls) );
    return el;
  }

  function findMeorAncestor(el, cls) {
    while ( !el.classList.contains(cls) && (el = el.parentElement) );
    return el;
  }



})();
