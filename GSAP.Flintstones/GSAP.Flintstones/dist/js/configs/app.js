angular.module('Flintstones.UI', ['ngAnimate'])
.controller('MainController', ['$timeout', '$window', MainController]);

function MainController($timeout, $window) {
    var self = this;
    self.timeout = $timeout;
    self.window = $window;
    self.showColorPicker = false;
    self.settingsPaneColorsInitalized = false;
    self.colorModes = [
        { id: _.uniqueId('col'), colorId: "turquoise", name: "turquoise", code: "#1abc9c" },
        { id: _.uniqueId('col'), colorId: "emerland", name: "emerland", code: "#2ecc71" },
        { id: _.uniqueId('col'), colorId: "nephritis", name: "nephritis", code: "#27ae60" },
        { id: _.uniqueId('col'), colorId: "peterRiver", name: "peter river", code: "#3498db" },
        { id: _.uniqueId('col'), colorId: "wetAsphalt", name: "wet asphalt", code: "#34495e" },
        { id: _.uniqueId('col'), colorId: "amethyst", name: "amethyst", code: "#9b59b6" },
        { id: _.uniqueId('col'), colorId: "carrot", name: "carrot", code: "#e67e22" },
        { id: _.uniqueId('col'), colorId: "alizarin", name: "alizarin", code: "#e74c3c" },
        { id: _.uniqueId('col'), colorId: "pomegranate", name: "pomegranate", code: "#c0392b" }
    ];
    self.activeColorMode = self.colorModes[3];

    self.grassLayer = document.getElementById('layer-grass');
    self.grassLayerMaxWidth = 3420;

    self.moonRings = document.getElementById('moon-rings');
    self.starsBg = document.getElementById('stars-bg');

    self.fred = document.getElementById('fred');
    self.fredLegLeft = document.getElementById('fred-leg-left');
    self.fredLegRight = document.getElementById('fred-leg-right');
    self.fredHandLeft = document.getElementById('fred-hand-left');
    self.fredHandRight = document.getElementById('fred-hand-right');
    self.fredHandsTransformOrigin = "30px 10px";
    self.fredDress = document.getElementById('fred-dress');

    self.wilma = document.getElementById('wilma');
    self.wilmaLegLeft = document.getElementById('wilma-leg-left');
    self.wilmaLegRight = document.getElementById('wilma-leg-right');
    self.wilmaHandLeft = document.getElementById('wilma-hand-left');
    self.wilmaHandRight = document.getElementById('wilma-hand-right');

    self.cart = document.getElementById('cart');
    self.cartWheelFront = document.getElementById('cart-wheel-front');
    self.cartWheelRear = document.getElementById('cart-wheel-rear');
    self.moon = document.getElementById('moon');
    self.plane = document.getElementById('plane');
    self.tail = document.getElementById('planeTail');

    self.house = document.getElementById('wilma-house');
    self.moonToggle = document.getElementById('layer-toggle');
    self.rose = document.getElementById('rose');
    self.mountains = document.getElementById('mountains');

    self.moonActive = false;

    angular.element(self.window).bind('resize', function (e) {
        self.adjsutGrassWidth();
    })

    self.animateMoonRings();
    self.initPlane();
    self.setHouseOutOfView();
    self.setMoonToRight();
    self.setWilmaOutOfView();
    self.setRoseToHide();
    self.setCartOutOfView();
    self.setMountainOutOfView();

    //INIT TWEENS
    TweenMax.set([self.fredHandLeft, self.fredHandRight], { rotation: 90, transformOrigin: self.fredHandsTransformOrigin });
    TweenMax.set([self.wilmaHandLeft, self.wilmaHandRight], { rotation: -90, transformOrigin: "right", x: ' -30px' });
    TweenMax.set(self.fredDress, { scaleY: 1.1, transformOrigin: "top" });

    //FRED MOVE HAND
    //TweenMax.to([self.fredHandRight], 2, { rotation: 0, transformOrigin: self.fredHandsTransformOrigin });

    //FRED RUNNING LEGS
    //$timeout(function () {
    //    self.fredRunningLegs();
    //}, 1000);
    //$timeout(function () {
    //    self.stopFredRunningLegs();
    //}, 5000);

    //WILMA WALKING LEGS
    //$timeout(function () {
    //    self.wilmaWalkingTowardsFred();
    //}, 1000);
    //$timeout(function () {
    //    self.stopFredRunningLegs();
    //}, 5000);

    //CART RUNNING LEGS
    //$timeout(function () {
    //    self.cartRunning();
    //}, 1000);
    //$timeout(function () {
    //    self.stopRunningCart();
    //}, 10000);

    //$timeout(function () {
    //    self.moveCartOutOfView();
    //}, 1000);

    //$timeout(function () {
    //    self.moveMoonToCorrectPosition();
    //}, 5000);

}

MainController.prototype.setMountainOutOfView = function () {
    var self = this;
    var _translateX = self.window.innerWidth;
    TweenMax.set(self.mountains, { x: _translateX });
}

MainController.prototype.moveCartOutOfView = function () {
    var self = this;
    var _cartPosition = self.cart.getBoundingClientRect();
    var _translateX = self.window.innerWidth;
    TweenMax.to(self.cart, 2, { x: _translateX });
}

MainController.prototype.setCartOutOfView = function () {
    var self = this;
    var _cartPosition = self.cart.getBoundingClientRect();
    var _translateX = self.window.innerWidth;
    TweenMax.set(self.cart, { x: _translateX });
}

MainController.prototype.setRoseToHide = function () {
    var self = this;
    TweenMax.set(self.rose, { opacity: 0, rotation: 90, transformOrigin: "center center" });
}

MainController.prototype.setMoonToRight = function () {
    var self = this;
    var _moonPosition = self.moon.getBoundingClientRect();
    var _translateX = (self.window.innerWidth - _moonPosition.right) / 2;
    if (self.window.innerWidth > _moonPosition.right)
        _translateX = (self.window.innerWidth - (_moonPosition.width / 2) - 60) - _moonPosition.right;
    TweenMax.set(self.moonToggle, { x: _translateX });
}

MainController.prototype.moveMoonToRight = function () {
    var self = this;
    var _moonPosition = self.moon.getBoundingClientRect();
    var _translateX = (self.window.innerWidth - _moonPosition.right) / 2;
    TweenMax.to(self.moonToggle, 0.5, { x: _translateX });
}

MainController.prototype.moveMoonToCorrectPosition = function () {
    var self = this;
    TweenMax.to(self.moonToggle, 0.5, { x: 0 });
}

MainController.prototype.setHouseOutOfView = function () {
    var self = this;
    TweenMax.set(self.house, { x: '2000px' });
}

MainController.prototype.moveHouseOutOfView = function () {
    var self = this;
    TweenMax.to(self.house, 2, { x: '2000px' });
}

MainController.prototype.moveHouseIntoOfView = function () {
    var self = this;
    TweenMax.to(self.house, 2, { x: 0 });
}

MainController.prototype.toggleMoon = function () {
    var self = this;
    self.moonActive = !self.moonActive;
}

MainController.prototype.initPlane = function () {
    var self = this;
    var _moonPosition = self.moon.getBoundingClientRect();
    var _planePosition = self.plane.getBoundingClientRect();

    self.plane.style.left = (_moonPosition.left - _planePosition.width) + 'px';
    self.plane.style.top = (_moonPosition.top - 3) + 'px';
    self.tail.style.left = _moonPosition.left + 'px';
    self.tail.style.top = (_moonPosition.top + _planePosition.height / 2 + 5) + 'px';
    var _maxTranslateX = (-(_moonPosition.left - _planePosition.width)) + 'px';
    self.planeTimeline = new TimelineMax({ repeat: -1 });
    self.planeTimeline
        .to(self.plane, 100, { x: _maxTranslateX + 'px', ease: Linear.easeNone })
        .to(self.tail, 100, { scaleX: _maxTranslateX, transformOrigin: "left", ease: Linear.easeNone }, "-=100")
        .to(self.plane, 5, { x: 0 + 'px', ease: Linear.easeNone })
        .to(self.tail, 5, { scaleX: 0, transformOrigin: "left", ease: Linear.easeNone }, "-=5");
}

MainController.prototype.setWilmaOutOfView = function () {
    var self = this;
    var _wilmaPosition = self.wilma.getBoundingClientRect();
    var _translateX = 0;
    if (self.window.innerWidth > _wilmaPosition.right) {
        _translateX = self.window.innerWidth - _wilmaPosition.right + 100;
        TweenMax.set(self.wilma, { x: _translateX });
    }
}

MainController.prototype.wilmaWalkingTowardsFred = function () {
    var self = this;
    self.fredLegsRunningTimeline = new TimelineMax({ repeat: -1 });
    self.fredLegsRunningTimeline
        .to(self.wilmaLegRight, 0.5, { rotation: -15, transformOrigin: "0 15px", ease: Linear.easeNone })
        .to(self.wilmaLegRight, 0.5, { rotation: 0, ease: Linear.easeNone })
        .to(self.wilmaLegRight, 0.5, { rotation: 15, ease: Linear.easeNone })
        .to(self.wilmaLegRight, 0.5, { rotation: 0, ease: Linear.easeNone })
        .to(self.wilmaLegLeft, 0.5, { rotation: 15, transformOrigin: "0 15px", ease: Linear.easeNone }, "-=2")
        .to(self.wilmaLegLeft, 0.5, { rotation: 0, ease: Linear.easeNone }, "-=1.5")
        .to(self.wilmaLegLeft, 0.5, { rotation: -15, ease: Linear.easeNone }, "-=1")
        .to(self.wilmaLegLeft, 0.5, { rotation: 0, ease: Linear.easeNone }, "-=0.50");
}

MainController.prototype.cartRunning = function () {
    var self = this;
    self.cartRunningTimeline = new TimelineMax({ repeat: -1 });
    self.cartRunningTimeline
        .to(self.cartWheelFront, 1, { rotation: 360, transformOrigin: "center", ease: Linear.easeNone })
        .to(self.cartWheelRear, 1, { rotation: 360, transformOrigin: "center", ease: Linear.easeNone }, "-=1")

    self.cartRunningTimeline.eventCallback('onStart', function () {
        document.getElementById('cart').classList.add('running');
    });

    self.cartRunningTimeline.eventCallback('onComplete', function () {
        document.getElementById('cart').classList.remove('running');
    });
}

MainController.prototype.stopRunningCart = function () {
    var self = this;
    if (self.cartRunningTimeline)
        self.cartRunningTimeline.repeat(0);
}

MainController.prototype.fredRunningLegs = function () {
    var self = this;
    self.fredLegsRunningTimeline = new TimelineMax({ repeat: -1 });
    self.fredLegsRunningTimeline
        .to(self.fredLegRight, 0.5, { rotation: 30, transformOrigin: "0 30px", ease: Linear.easeNone })
        .to(self.fredLegRight, 0.5, { rotation: 0, ease: Linear.easeNone })
        .to(self.fredLegRight, 0.5, { rotation: -30, ease: Linear.easeNone })
        .to(self.fredLegRight, 0.5, { rotation: 0, ease: Linear.easeNone })
        .to(self.fredLegLeft, 0.5, { rotation: -30, transformOrigin: "0 30px", ease: Linear.easeNone }, "-=2")
        .to(self.fredLegLeft, 0.5, { rotation: 0, ease: Linear.easeNone }, "-=1.5")
        .to(self.fredLegLeft, 0.5, { rotation: 30, ease: Linear.easeNone }, "-=1")
        .to(self.fredLegLeft, 0.5, { rotation: 0, ease: Linear.easeNone }, "-=0.50");

    self.fredLegsRunningTimeline.timeScale(8);
}

MainController.prototype.stopFredRunningLegs = function () {
    var self = this;
    if (self.fredLegsRunningTimeline)
        self.fredLegsRunningTimeline.repeat(0);
}

MainController.prototype.animateMoonRings = function () {
    var self = this;
    self.moonTimeline = new TimelineMax({ repeat: -1 });
    self.moonTimeline
        .to(self.moonRings, 5, { scaleX: 1.10, scaleY: 1.10, ease: Elastic.easeOut.config(1, 0.5), transformOrigin: "center", })
        .to(self.moonRings, 5, { scaleX: 1, scaleY: 1, ease: Elastic.easeOut.config(1, 0.5), transformOrigin: "center", });
}

MainController.prototype.adjsutGrassWidth = function (e) {
    var self = this;
    var _svgWidth = self.window.innerWidth * 2 >= 3420 ? 3420 : self.window.innerWidth * 2;
    self.grassLayer.setAttribute("viewBox", "0 0 " + _svgWidth + " 74.5");
}

MainController.prototype.panmove = function (e) {
    var self = this;
    e.pageX = e.center.x;
    e.pageY = e.center.y;
    self.mouseMove(e);
}

MainController.prototype.openColorPicker = function () {
    var self = this;
    if (self.showColorPicker == false) {
        self.showColorPicker = true;
        self.settingsPaneColorsInitalized = true;
        self.shownColorModes = [];
        self.timeout(function () {
            _.each(self.colorModes, function (cm, iter) {
                self.shownColorModes.push(cm);
                cm.transition = 'all ' + (50 + (150 * (iter + 1))) + 'ms' + ' ease-out';
            });
            _.each(self.colorModes, function (cm, iter) {
                self.timeout(function () {
                    var _elem = document.getElementById('color_' + cm.colorId);
                    _elem.style.transform = 'rotate(' + (-150 + (iter * 18)) + 'deg)';
                }, 400);
            });
        }, 400);
    }
    else {
        self.showColorPicker = false;
        self.timeout(function () {
            self.settingsPaneColorsInitalized = false;
            self.shownColorModes = [];
        }, 300);
    }
}

MainController.prototype.closeColorPicker = function () {
    var self = this;
    self.showColorPicker = false;
    self.timeout(function () {
        self.settingsPaneColorsInitalized = false;
        self.shownColorModes = [];
    }, 300);
}

MainController.prototype.choseColor = function (color) {
    var self = this;
    self.activeColorMode = color;
}

MainController.prototype.goToContent = function () {
    var self = this;
    var _contentElem = document.getElementById('portfolioContent');
    var _scrollTo = _contentElem.getBoundingClientRect().top;
    $('html, body').animate({
        scrollTop: _scrollTo
    }, 300);
}