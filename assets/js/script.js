$('body').addClass('loaded');



var wow = new WOW({
    //	boxClass: 'wow', // default
    //	animateClass: 'animated', // default
    //	offset: 0, // default
    mobile: false, // default
    //live: false // default
    //	callback: function (box) {
    //	}
});
wow.init();


setTimeout(function () {
    $('body').addClass('loaded');
}, 4000);


var LoadedMap = false;
function loadMap() {
    if(LoadedMap) return;
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAmWmdKbeYcWqCZrLJSoMV6ygZgELvWxmE", function () {
        $.getScript("assets/js/infobox.js", function () {
            $.getScript("assets/js/map.js");
            LoadedMap = true;
        });
    });
}


if ($('.js-map').length > 0) loadMap();



function loadFancy() {
    $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.css'));
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.js", function () {
        $('.js-btn-modal').fancybox({
            animationDuration: 350,
            animationEffect: 'material',
            beforeShow: function (e) {}
        });


    });
}



var g = {
    getOs: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        return "unknown";
    }
}

var os = g.getOs(),
    eventClick = os == 'iOS' ? 'touchstart' : 'click';


(function () {
    var form = {
        url: 'ajax',
        load: function (tpl, id) {
            var data = {
                data: tpl,
                action: 'loadForm'
            };

            if (id) data.id = id;

            $.ajax({
                url: this.url,
                type: "POST",
                data: data,
                success: function (data) {
                    $('#modal-content .modal-body').html(data);
                    $('#modal-content').modal('show');
                }
            });
        },
        valid: function (par) {
            var valid = true,
                name = '',
                patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            $(par).find("input.required, textarea.required").each(function (i, e) {
                $(e).removeClass("in-error");
                name = $(e).attr('name');
                if (name == 'email' && !patternEmail.test($(e).val())) {
                    if (valid)
                        $(e).focus();
                    $(e).addClass("in-error");
                    valid = false;
                }
                if ($(e).val() == "") {
                    if (valid)
                        $(e).focus();
                    $(e).addClass("in-error");
                    valid = false;
                }
            });
            return valid;
        },

        send: function (that) {
            var formData = new FormData($(that).get(0));
            $(that).addClass('loder');
            var action = $(that).data('action');
            if (action) formData.append('action', action);
            formData.append('pagetitle', $('title').text());
            formData.append('link', location.href);
            $.ajax({
                url: this.url,
                type: "POST",
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log(data);
                    txt = '<div class="alert alert-' + data.type + '">' + data.text + '</div>';
                    $(that).find('.btns').before(txt);
                    if (data.type == 'success') {
                        $(that).find('input[type=text], input[type=email]').val('');
                        $(that).find('textarea').val('');
                    }
                    $(that).removeClass('loder');
                    var time = 5000;
                    if (data.url) time = 3000;

                    setTimeout(function () {
                        $.fancybox.close();
                        if (data.url) {
                            location.href = data.url;
                        }
                        $('.alert').remove();
                        $('.js-in').removeClass('comp');
                    }, time);
                }
            });

        }
    }


    if ($('a[data-fancybox]').length > 0) {
        loadFancy();
    }

    // copy nav
    $('body').append('<div class="mob-nav"><div class="close-modal hidden-lg"></div><div class="main-nav">' + $('.main-nav').html() + '</div></div>');


    // mob mav
    $(document).on(eventClick, '.js-open-nav', function () {
        $('.mob-nav').addClass('active');
        $('body').append('<div class="mask-site"></div>');
        setTimeout(function () {
            $('body').addClass('o-hide');
        }, 10);
    });

    $(document).on(eventClick, '.mask-site, .close-modal, .mob-nav a', function () {
        $('.mob-nav').removeClass('active');
        $('.mask-site').remove();
        setTimeout(function () {
            $('body').removeClass('o-hide');
        }, 100);

    });


    $(document).on('submit', '.js-form', function (e) {
        e.preventDefault();
        if (form.valid(this)) {
            form.send(this);
        }
    });


    if ($('a[href="#"]').length > 0) {
        $(document).on('click', 'a[href="#"]', function (e) {
            e.preventDefault();
        })
    }

    $('.slider').owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        dots: false,
        items: 1,
        center: true,
        //  autoplay: true,
        smartSpeed: 900,
        autoplaySpeed: 900,
        autoplayTimeout: 6000,
        navText: ['', ''],
        responsiveClass: true,
    });


    $('.gal-list').owlCarousel({
        loop: false,
        margin: 34,
        nav: true,
        dots: false,
        items: 3,
        // autoplay: true,
        smartSpeed: 400,
        autoplaySpeed: 400,
        autoplayTimeout: 4000,
        navText: ["", ""],
        responsiveClass: true,
        // center:true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2,
            },
            1000: {
                items: 3,
                nav: true,
            }
        }
    });



    $('input[name=phone]').mask('+38(000) 000 00 00');




    var offset = 30;
    if($(window).width() < 700 ){
        offset = 15;
    }

    // scroll header
    $('.js-scroll, .main-nav a').on(eventClick, function (e) {
        e.preventDefault();
        $('body').scrollTo($(this).attr('href'), 500, {
            offset: - ($('.header').outerHeight() + offset)
        });
    });

    
    $(document).on(eventClick, '.main-nav a', function(){
        $('.main-nav a').removeClass('active');
        $(this).addClass('active');
    });

    $(document).scroll(function() {
      var top = $(window).scrollTop();
      if(top > 100){
          $('.header').addClass('white');
      } else{
        $('.header').removeClass('white');
      }
    });


})();