(function () {
    angular.module('Flintstones.UI', [])
    .controller('MainController', ['$timeout', '$window', '$browserService', MainController])
    .service('$browserService', BrowserService);
    function BrowserService() {
        var self = this;
        self.browserSupported = true;
        self.isIESupported = false;
    }
    BrowserService.prototype.isBrowserSupported = function () {
        var self = this;
        if (typeof detect !== 'undefined' && detect != null && detect != {}) {
            if (typeof navigator !== 'undefined' && navigator != null && navigator != {}) {
                if (typeof navigator.userAgent !== 'undefined' && navigator.userAgent != null && navigator.userAgent != {}) {
                    var _parsed = detect.parse(navigator.userAgent);
                    if (typeof _parsed !== 'undefined' && _parsed != null && _parsed != {} && typeof _parsed.browser !== 'undefined' && _parsed.browser != null && _parsed.browser != {}) {
                        if (_parsed.browser.family == 'IE')
                            self.browserSupported = self.isIESupported;
                    }
                }
            }
        }
        return self.browserSupported;
    }
    function MainController($timeout, $window, $browserService) {
        var self = this;
        self.browserService = $browserService;
        self.browserSupported = self.browserService.isBrowserSupported();
        self.timeout = $timeout;
        self.window = $window;
        self.showColorPicker = false;
        self.darkMode = false;
        self.multiColored = false;
        self.settingsPaneColorsInitalized = false;
        self.colorModes = [
            { id: _.uniqueId('col'), colorId: "peterRiver", name: "peter river", code: "#3498db" },
            { id: _.uniqueId('col'), colorId: "turquoise", name: "turquoise", code: "#1abc9c" },
            { id: _.uniqueId('col'), colorId: "emerland", name: "emerland", code: "#2ecc71" },
            { id: _.uniqueId('col'), colorId: "multicolored", name: "multicolored", code: "#f1c40f" },
            { id: _.uniqueId('col'), colorId: "wetAsphalt", name: "wet asphalt", code: "#000" },
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
        self.fredBody = document.getElementById('fred-body');
        self.fredLegLeft = document.getElementById('fred-leg-left');
        self.fredLegRight = document.getElementById('fred-leg-right');
        self.fredHandLeft = document.getElementById('fred-hand-left');
        self.fredHandRight = document.getElementById('fred-hand-right');
        self.fredHandsTransformOrigin = "30px 10px";
        self.fredDress = document.getElementById('fred-dress');
        self.fredHead = document.getElementById('fred-head');

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
        self.wilmaHair = document.getElementById('wilma-hair');

        self.house = document.getElementById('wilma-house');
        self.moonToggle = document.getElementById('layer-toggle');
        self.rose = document.getElementById('rose');
        self.mountains = document.getElementById('mountains');
        self.startBtn = document.getElementById('start-btn');
        self.startBtnHolder = document.getElementById('start-btn-holder');

        self.club = document.getElementById('club');

        self.moonActive = false;
        self.inMotion = false;
        self.animationComplete = false;

        angular.element(self.window).bind('resize', function (e) {
            self.adjsutGrassWidth();
        });

        self.initialFredPosition = self.fred.getBoundingClientRect();
        self.initialFredBodyPosition = self.fredBody.getBoundingClientRect();
        self.initialCartPosition = self.cart.getBoundingClientRect();
        self.initialRosePosition = self.rose.getBoundingClientRect();
        self.widthCartFredDiff = (self.initialCartPosition.width - self.initialFredBodyPosition.width) / 2;
        self.wilmaHandLeftInitial = self.wilmaHandLeft.getBoundingClientRect();

        self.animateMoonRings();
        self.initPlane();
        self.setHouseOutOfView();
        self.setMoonToRight();
        self.setWilmaOutOfView();
        self.setRoseToHide();
        self.setCartOutOfView();
        self.setMountainOutOfView();

        if (self.browserSupported == false) {
            self.startBtn.textContent = 'oopsie !   browser not supprted :(';
        }

        //INIT TWEENS
        TweenMax.set([self.fredHandLeft, self.fredHandRight], { rotation: 90, transformOrigin: self.fredHandsTransformOrigin });
        TweenMax.set([self.wilmaHandLeft, self.wilmaHandRight], { rotation: -90, transformOrigin: "right", x: ' -30px' });
        TweenMax.set(self.club, { opacity: 0 });
        TweenMax.set(self.fredDress, { scaleY: 1.1, transformOrigin: "top" });

    }

    MainController.prototype.startMotion = function () {
        var self = this;
        if (self.browserSupported == false) {
            return;
        }
        if (self.animationComplete) {
            location.reload();
            return;
        }
        else
            self.startBtnHolder.style.display = "none";
        self.inMotion = true;
        self.fredRunningLegs();
        self.moveFredOutOfViewToCart();
        var _translateX = self.window.innerWidth + 'px';
        var _fredPosition = self.fred.getBoundingClientRect();
        var _fredBodyPosition = self.fredBody.getBoundingClientRect();
        var _cartPosition = self.cart.getBoundingClientRect();
        var _cartToFredTranslate = _cartPosition.left - (self.window.innerWidth / 2) - (_cartPosition.width / 2);
        var _fredToCartTranslate = (self.window.innerWidth / 2) - (_fredBodyPosition.width / 2);
        var _fredTimeline = new TimelineMax();
        var _stop = false;
        _fredTimeline
            .to(self.fred, 0.3, { x: (_fredPosition.left - 100) })
            .to(self.fred, 2, { x: _translateX, ease: Power1.easeIn })
            .to(self.fred, 0.05, {
                opacity: 0, onComplete: function () {
                    TweenMax.set(self.fred, { x: -(0.50 * self.window.innerWidth) });
                }
            })
            .to(self.fred, 0.1, { opacity: 1 })
            .to(self.fred, 2, {
                x: _fredToCartTranslate, ease: Power3.easeOut, onUpdate: function (e) {
                    if (this.progress() * 100 > 68) {
                        if (!_stop) {
                            self.stopFredRunningLegs();
                            _stop = true;
                        }
                    }
                }
            })
            .to(self.cart, 0.5, { x: _cartToFredTranslate, ease: Power3.easeOut }, "-=1.5")
            .to(self.cart, 0.75, {
                y: -30, ease: Power3.easeInOut, onComplete: function () {
                    self.getCartRunningWithFred();
                }
            }, "-=0.25");
    }

    MainController.prototype.getCartRunningWithFred = function () {
        var self = this;
        var _fredPosition = self.fred.getBoundingClientRect();
        var _cartPosition = self.cart.getBoundingClientRect();
        self.cartRunning();
        self.fredRunningLegs();
        var _fredInitialTranslate = _fredPosition.left - 200;
        var _cartInitialTranslate = _cartPosition.left - 200;
        var _finalMountainPosition = 0.05 * self.window.innerWidth;
        var _cartRunningWithFred = new TimelineMax();
        var _midFredTranslateX = (1.5 * self.window.innerWidth) + 'px';
        var _midCardTranslateX = (1.5 * self.window.innerWidth) - (_fredPosition.left - _cartPosition.left) + 'px';

        var _fredHandPosition = self.fredHandRight.getBoundingClientRect();
        var _fredHandLength = _fredHandPosition.bottom - _fredHandPosition.top;

        var _stop = false;

        _cartRunningWithFred
            .to(self.fred, 0.3, { x: _fredInitialTranslate })
            .to(self.cart, 0.3, { x: _cartInitialTranslate }, "-=0.3")
            .to(self.fred, 2, {
                x: _midFredTranslateX, ease: Power1.easeIn, onComplete: function () {
                    TweenMax.set(self.fred, { opacity: 0 });
                    TweenMax.set(self.fred, { x: -(self.window.innerWidth) });
                }
            })
            .to(self.cart, 2, {
                x: _midCardTranslateX, ease: Power1.easeIn, onComplete: function () {
                    TweenMax.set(self.cart, { opacity: 0 });
                    TweenMax.set(self.cart, { x: -(self.window.innerWidth) });
                }
            }, "-=2")
            .to(self.mountains, 2, { x: 0 })
            .to([self.fred, self.cart], 0.1, { opacity: 1 }, "-=2")
            .to(self.fred, 2, { x: self.widthCartFredDiff + _finalMountainPosition }, "-=1")
            .to(self.cart, 2, { x: _finalMountainPosition }, "-=2")
            .to(self.house, 1, { x: 0 }, "-=2")
            .to(self.cart, 0.75, {
                y: 0, ease: Power3.easeInOut, onComplete: function () {
                    self.stopRunningCart();
                }
                , onUpdate: function (e) {
                    if (this.progress() * 100 > 40) {
                        if (!_stop) {
                            self.stopFredRunningLegs();
                            _stop = true;
                        }
                    }
                }
            })
            .to(self.wilma, 1, {
                x: -(self.wilma.getBoundingClientRect().width * 0.5), onComplete: function () {
                    self.fredRunningLegs(4);
                    self.wilmaWalking(4);
                    _stop = false;
                }
            })
            .to(self.fred, 2, {
                x: (self.window.innerWidth / 2 - (self.fredBody.getBoundingClientRect().width)), onComplete: function () {
                    var _fredPosition = self.fredBody.getBoundingClientRect();
                    var _rosePosition = self.rose.getBoundingClientRect();
                    var _fredleftHandPosition = self.fredHandLeft.getBoundingClientRect();
                    var _rosePointX = _fredPosition.right - _rosePosition.width - 5;
                    var _rosePointY = _fredleftHandPosition.bottom - _fredleftHandPosition.top + 15;
                    TweenMax.set(self.rose, { opacity: 0, x: _rosePointX });
                }, onUpdate: function (e) {
                    if (this.progress() * 100 > 70) {
                        if (!_stop) {
                            self.stopFredRunningLegs();
                            _stop = true;
                        }
                    }
                }
            }, "-=0.5")
            .to(self.cart, 2, { x: -1000 }, "-=1")
            .to(self.wilma, 2, {
                x: -(self.window.innerWidth / 2 - 25), onComplete: function () {
                    self.stopWilmaRunningLegs();
                }
            }, "-=1")
            .to(self.fredHandRight, 0.50, {
                rotation: 0, transformOrigin: self.fredHandsTransformOrigin, ease: Power2.easeOut, onComplete: function () {
                    var _fredHandPosition = self.fredHandRight.getBoundingClientRect();
                    var _rosePointX = _fredHandPosition.right - self.initialRosePosition.width - 5;
                    var _rosePosition = self.rose.getBoundingClientRect();
                    TweenMax.set(self.rose, { opacity: 0, x: _rosePointX, y: -(self.window.innerHeight - _fredHandPosition.top - (_rosePosition.height / 2)) });
                    TweenMax.set(self.rose, { scaleY: 0, transformOrigin: "center" });
                }
            })
            .to(self.rose, 0.75, {
                opacity: 1, scaleY: 1, transformOrigin: "bottom", onComplete: function () {
                    self.succeed = self.moonActive;
                    self.reset();
                }
            });        
    }

    MainController.prototype.reset = function () {
        var self = this;
        if (self.succeed != true) {
            var _resetTimeline = new TimelineMax();
            var _fredPosition = self.fred.getBoundingClientRect();
            var _fredBodyPosition = self.fredBody.getBoundingClientRect();
            var _wilmaLeftHandPosition = self.wilmaHandLeft.getBoundingClientRect();
            var _clubPosition = self.club.getBoundingClientRect();
            console.log(_wilmaLeftHandPosition);
            var _start = false;
            TweenMax.set(self.club, { opacity: 1});
            _resetTimeline
            .to(self.wilmaHandLeft, 0.50, {
                rotation: 45, transformOrigin: "right", x: 0, onComplete: function () {                    
                    TweenMax.to(self.club, 0.30, { rotation: 60, transformOrigin:"200px 30px" });
                }, onUpdate: function () {
                    var _wilmaLeftHandPosition = self.wilmaHandLeft.getBoundingClientRect();
                    TweenMax.set(self.club, { y: -(self.window.innerHeight - _wilmaLeftHandPosition.top - _clubPosition.height - self.wilmaHandLeftInitial.height), x: -(self.window.innerWidth + _clubPosition.width - _wilmaLeftHandPosition.left - (_clubPosition.width * 0.25 )) });
                }
            })

            .to(self.club, 0.30, { rotation: 0, transformOrigin: "200px 30px" }, "+=0.40")
            .to(self.fredHead, 0.20, { scaleY: 0.40, scaleX: 1.10, transformOrigin: "bottom" }, "-=0.20")    
            .to(self.club, 0.30, { rotation: 60, transformOrigin: "200px 30px" })
            .to(self.fredHead, 0.30, { scaleY: 1, scaleX: 1, transformOrigin: "bottom" }, "-=0.30")

            .to(self.rose, 0.75, { scaleY: 0, y: 200, transformOrigin: "top" }, "-=0.50")
             
            .to(self.club, 0.30, { x: self.window.innerWidth, y: -self.window.innerHeight }, "-=0.20")
            .to(self.fredHandRight, 0.30, { rotation: 90, transformOrigin: self.fredHandsTransformOrigin, ease: Power2.easeOut })
            .to(self.wilmaHandLeft, 0.50, {
                rotation: -90, transformOrigin: "right", x: -30, onComplete: function () {
                    TweenMax.set(self.wilma, { scaleX: -1 });
                    self.wilmaWalking(4);
                }
            }, "-=0.25")
            .to(self.wilma, 1.5, {
                x: self.window.innerWidth, ease: Power1.easeIn
            });
            _resetTimeline.eventCallback('onComplete', function () {
                TweenMax.set([self.fred, self.cart], { scaleX: -1 });
                _resetTimeline.to(self.cart, 2, {
                    x: self.fred.getBoundingClientRect().left - (_fredBodyPosition.width / 2), onComplete: function () {
                        self.fredRunningLegs();
                    }
                })
                .to(self.cart, 0.75, { y: -30, ease: Power3.easeInOut })
                .to([self.cart, self.fred], 1, { x: -1000, ease: Power2.easeIn })
                .to(self.house, 1, {
                    x: self.window.innerWidth, onComplete: function () {
                        self.animationComplete = true;
                        self.inMotion = false;
                        self.startBtn.textContent = 'ouch !   again ?';
                        self.startBtnHolder.style.display = "block";
                    }
                }, "-=0.50")
                .to(self.mountains, 1, {
                    x: self.window.innerWidth
                }, "-=1.25");
                _resetTimeline.eventCallback('onComplete', null);
            });
        }
        else if (self.succeed == true) {
            var _resetTimeline = new TimelineMax();
            var _fredPosition = self.fred.getBoundingClientRect();
            var _fredBodyPosition = self.fredBody.getBoundingClientRect();
            var _wilmaHairPosition = self.wilmaHair.getBoundingClientRect();
            var _rosePosition = self.rose.getBoundingClientRect();
            var _wilmaHairWithRoseX = _wilmaHairPosition.right - (_wilmaHairPosition.width / 2);
            var _wilmaHairWithRoseY = -(self.window.innerHeight - _wilmaHairPosition.top - (_rosePosition.height * 0.80));
            _resetTimeline
                .to(self.wilmaHandLeft, 1, { rotation: 0, transformOrigin: "right", x: 0 }, "-=0.25")
                .to(self.fredHandRight, 0.75, {rotation: 90, transformOrigin: self.fredHandsTransformOrigin, ease: Power2.easeOut})
                .to(self.rose, 1, { y: _wilmaHairWithRoseY, x: _wilmaHairWithRoseX })
                .to(self.wilmaHandLeft, 1, {
                    rotation: 90, transformOrigin: "right", onComplete: function () {
                        TweenMax.set(self.fred, { x: self.fred.getBoundingClientRect().left - 100 });
                        TweenMax.set([self.fred, self.cart], { scaleX: -1 });
                    }
                }, "-=1")
                .to(self.wilmaHandLeft, 1, { rotation: -90, x: -30, transformOrigin: "right" })
                .to(self.cart, 2, {
                    x: self.fred.getBoundingClientRect().left - (_fredBodyPosition.width / 2) - 50, onComplete: function () {
                        self.wilmaWalking(2);
                    }
                })
                .to(self.wilma, 1, { x: self.getWilmaInCartPosition() })
                .to(self.rose, 1, {
                    x: self.getWilmaRoseInCartPosition(), onComplete: function () {
                        self.changeWilmaWalkingSpeed(6);
                        self.fredRunningLegs(6);
                    }
                }, "-=1")
                .to(self.cart, 0.75, {
                    y: -30, ease: Power3.easeInOut, onComplete: function () {
                        TweenMax.set(self.rose, { opacity: 0 })
                    }
                })
                .to([self.cart, self.fred], 1, { x: -1000, ease: Power2.easeIn })
                .to(self.wilma, 1, { x: -(1000 + self.window.innerWidth), ease: Power2.easeIn }, "-=1")
                .to(self.house, 1, {
                    x: self.window.innerWidth, onComplete: function () {
                        self.animationComplete = true;
                        self.inMotion = false;
                        self.startBtn.textContent = 'yay !   again ?';
                        self.startBtnHolder.style.display = "block";
                    }
                }, "-=0.50")
                .to(self.mountains, 1, {
                    x: self.window.innerWidth
                }, "-=1.25");
        }
    }

    MainController.prototype.getWilmaInCartPosition = function () {
        var self = this;
        var _cartPosition = self.cart.getBoundingClientRect();
        var _translateX = (self.window.innerWidth / 2 + self.wilma.getBoundingClientRect().width - 150);
        self.tempChangeInX = self.wilma.getBoundingClientRect().left - _translateX;
        return -_translateX;
    }

    MainController.prototype.getWilmaRoseInCartPosition = function () {
        var self = this;
        var _rosePosition = self.rose.getBoundingClientRect();
        var _translateX = _rosePosition.left + (self.tempChangeInX / 2);
        return _translateX;
    }

    MainController.prototype.moveFredOutOfViewToCart = function () {
        var self = this;
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
        TweenMax.set(self.rose, { opacity: 0, transformOrigin: "center center" });
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
        TweenMax.to(self.house, 0.3, { x: 0 }, "-=1");
    }

    MainController.prototype.toggleMoon = function () {
        var self = this;
        self.moonActive = !self.moonActive;
        var _moonPosition = self.moon.getBoundingClientRect();
        if (self.moonActive) {
            self.moveMoonToCorrectPosition();
            TweenMax.set(self.moonToggle, { scaleX: -1 });
        }
        else {
            TweenMax.set(self.moonToggle, { scaleX: 1 });
            self.moveMoonToRight();
        }
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
        TweenMax.set(self.wilma, { x: 200 });

    }

    MainController.prototype.wilmaWalking = function (_scale) {
        var self = this;
        _scale = _scale || 8;
        self.wilmaLegsRunningTimeline = new TimelineMax({ repeat: -1 });
        self.wilmaLegsRunningTimeline
            .to(self.wilmaLegRight, 0.5, { rotation: -15, transformOrigin: "0 15px", ease: Linear.easeNone })
            .to(self.wilmaLegRight, 0.5, { rotation: 0, ease: Linear.easeNone })
            .to(self.wilmaLegRight, 0.5, { rotation: 15, ease: Linear.easeNone })
            .to(self.wilmaLegRight, 0.5, { rotation: 0, ease: Linear.easeNone })
            .to(self.wilmaLegLeft, 0.5, { rotation: 15, transformOrigin: "0 15px", ease: Linear.easeNone }, "-=2")
            .to(self.wilmaLegLeft, 0.5, { rotation: 0, ease: Linear.easeNone }, "-=1.5")
            .to(self.wilmaLegLeft, 0.5, { rotation: -15, ease: Linear.easeNone }, "-=1")
            .to(self.wilmaLegLeft, 0.5, { rotation: 0, ease: Linear.easeNone }, "-=0.50");

        self.wilmaLegsRunningTimeline.timeScale(_scale);
    }

    MainController.prototype.changeWilmaWalkingSpeed = function (_scale) {
        self.wilmaLegsRunningTimeline.timeScale(_scale);
    }

    MainController.prototype.stopWilmaRunningLegs = function () {
        var self = this;
        if (self.wilmaLegsRunningTimeline)
            self.wilmaLegsRunningTimeline.repeat(0);
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

    MainController.prototype.fredRunningLegs = function (_scale) {
        var self = this;
        _scale = _scale || 6;
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

        self.fredLegsRunningTimeline.timeScale(_scale);
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
        if (self.activeColorMode.colorId == 'wetAsphalt') {
            self.darkMode = true;
        }
        else
            self.darkMode = false;
    }

    MainController.prototype.goToContent = function () {
        var self = this;
        var _contentElem = document.getElementById('portfolioContent');
        var _scrollTo = _contentElem.getBoundingClientRect().top;
        $('html, body').animate({
            scrollTop: _scrollTo
        }, 300);
    }
})()

