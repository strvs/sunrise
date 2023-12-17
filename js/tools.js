$(document).ready(function() {

    $('.header-menu-link').click(function(e) {
        var curScroll = $(window).scrollTop();
        var curWidth = $(window).width();
        if (curWidth < 390) {
            curWidth = 390;
        }
        $('html').addClass('menu-open');
        $('html').data('scrollTop', curScroll);
        if (curWidth == 390) {
            $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
        }
        e.preventDefault();
    });

    $('.header-menu-close').click(function(e) {
        $('html').removeClass('menu-open');
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $(window).scrollTop($('html').data('scrollTop'));
        e.preventDefault();
    });

    $('.menu-item a').click(function(e) {
        var curBlock = $('[data-id="' + $(this).attr('href').split('#')[1] + '"]');
        if (curBlock.length == 1) {
            $('html').removeClass('menu-open');
            $('meta[name="viewport"]').attr('content', 'width=device-width');
            $(window).scrollTop($('html').data('scrollTop'));
            $('html, body').animate({'scrollTop': curBlock.offset().top});
            e.preventDefault();
        }
    });

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        $('.window-link').removeClass('last-active');
        curLink.addClass('last-active');
        windowOpen(curLink.attr('href'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $('body').on('click', '.window-close, .window-close-btn', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.presentation-photo-slider').each(function() {
        var curSlider = $(this);
        const swiper = new Swiper(curSlider[0], {
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });
    });

    $('.location').each(function() {

        var locationMapWidth = 1440;
        var locationMapHeight = 775;

        if ($(window).width() < 1488) {
            locationMapWidth = 1152;
            locationMapHeight = 620;
        }

        if ($(window).width() < 1200) {
            locationMapWidth = 836;
            locationMapHeight = 450;
        }

        $('.location-map').data('zoom', 1);
        $('.location-map-img').data('curLeft', 0);
        $('.location-map-img').data('curTop', 0);

        var locationMapZoomIntensity = 0.5;

        $('body').on('click', '.location-zoom-inc', function(e) {
            var curZoom = Number($('.location-map').data('zoom'));

            var curLeft = Number($('.location-map-img').data('curLeft'));
            var curTop = Number($('.location-map-img').data('curTop'));

            var mouseX = locationMapWidth / 2;
            var mouseY = locationMapHeight / 2;

            var scale = curZoom + locationMapZoomIntensity;
            curLeft += mouseX / (curZoom * scale) - mouseX / curZoom;
            curTop += mouseY / (curZoom * scale) - mouseY / curZoom;

            curZoom = curZoom + locationMapZoomIntensity;
            $('.location-map').data('zoom', curZoom);

            $('.location-map-img').css({'transform': 'translate(' + curLeft + 'px, ' + curTop + 'px)', 'width': curZoom * locationMapWidth, 'height': curZoom * locationMapHeight});
            $('.location-map-img').data('curLeft', curLeft);
            $('.location-map-img').data('curTop', curTop);
            e.preventDefault();
        });

        $('body').on('click', '.location-zoom-dec', function(e) {
            var curZoom = Number($('.location-map').data('zoom'));

            var curLeft = Number($('.location-map-img').data('curLeft'));
            var curTop = Number($('.location-map-img').data('curTop'));

            var mouseX = locationMapWidth / 2;
            var mouseY = locationMapHeight / 2;

            var scale = curZoom - locationMapZoomIntensity;
            if (scale < 1) {
                scale = 1;
            }
            curLeft -= mouseX / (curZoom * scale) - mouseX / curZoom;
            curTop -= mouseY / (curZoom * scale) - mouseY / curZoom;
            if (scale == 1) {
                curLeft = 0;
                curTop = 0;
            }

            curZoom = curZoom - locationMapZoomIntensity;
            if (curZoom < 1) {
                curZoom = 1;
            }
            $('.location-map').data('zoom', curZoom);

            if (curLeft > 0) {
                curLeft = 0;
            }
            if (curLeft < $('.location-map').width() - curZoom * locationMapWidth) {
                curLeft = $('.location-map').width() - curZoom * locationMapWidth;
            }
            if (curTop > 0) {
                curTop = 0;
            }
            if (curTop < $('.location-map').height() - curZoom * locationMapHeight) {
                curTop = $('.location-map').height() - curZoom * locationMapHeight;
            }

            $('.location-map-img').css({'transform': 'translate(' + curLeft + 'px, ' + curTop + 'px)', 'width': curZoom * locationMapWidth, 'height': curZoom * locationMapHeight});
            $('.location-map-img').data('curLeft', curLeft);
            $('.location-map-img').data('curTop', curTop);
            e.preventDefault();
        });

        var mapDrag = false;
        var mapMove = false;
        var mapMoveTimer = null;
        var mapStartX = 0;
        var mapStartY = 0;

        if ($(window).width() >= 1200) {
            $('.location-map').on('mousedown', function(e) {
                if (Number($('.location-map').data('zoom')) > 1) {
                    mapDrag = true;
                    mapStartX = e.pageX;
                    mapStartY = e.pageY;
                }
            });

            $('.location-map').on('mousemove', function(e) {
                if (mapDrag) {
                    mapMove = true;
                    var curLeft = Number($('.location-map-img').data('curLeft'));
                    var curTop = Number($('.location-map-img').data('curTop'));
                    var curDiffX = e.pageX;
                    var curDiffY = e.pageY;
                    curDiffX = curDiffX - mapStartX;
                    curDiffY = curDiffY - mapStartY;
                    curLeft += curDiffX;
                    if (curLeft > 0) {
                        curLeft = 0;
                    }
                    var curZoom = Number($('.location-map').data('zoom'));
                    if (curLeft < $('.location-map').width() - curZoom * locationMapWidth) {
                        curLeft = $('.location-map').width() - curZoom * locationMapWidth;
                    }
                    curTop += curDiffY;
                    if (curTop > 0) {
                        curTop = 0;
                    }
                    if (curTop < $('.location-map').height() - curZoom * locationMapHeight) {
                        curTop = $('.location-map').height() - curZoom * locationMapHeight;
                    }
                    mapStartX = e.pageX;
                    mapStartY = e.pageY;
                    $('.location-map-img').css({'transform': 'translate(' + curLeft + 'px, ' + curTop + 'px)'});
                    $('.location-map-img').data('curLeft', curLeft);
                    $('.location-map-img').data('curTop', curTop);
                }
            });

            $(document).on('mouseup', function(e) {
                mapDrag = false;
                if (mapMove) {
                    window.clearTimeout(mapMoveTimer);
                    mapMoveTimer = null;
                    mapMoveTimer = window.setTimeout(function() {
                        mapMove = false;
                    }, 100);
                }
            });
        } else {
            $('.location-map').on('touchstart', function(e) {
                mapDrag = true;
                mapStartX = e.originalEvent.touches[0].pageX;
                mapStartY = e.originalEvent.touches[0].pageY;
            });

            $('.location-map').on('touchmove', function(e) {
                if (mapDrag) {
                    var curLeft = Number($('.location-map-img').data('curLeft'));
                    var curTop = Number($('.location-map-img').data('curTop'));
                    var curDiffX = e.originalEvent.touches[0].pageX;
                    var curDiffY = e.originalEvent.touches[0].pageY;
                    curDiffX = curDiffX - mapStartX;
                    curDiffY = curDiffY - mapStartY;
                    curLeft += curDiffX;
                    if (curLeft > 0) {
                        curLeft = 0;
                    }
                    var curZoom = Number($('.location-map').data('zoom'));
                    if (curLeft < $('.location-map').width() - curZoom * locationMapWidth) {
                        curLeft = $('.location-map').width() - curZoom * locationMapWidth;
                    }
                    curTop += curDiffY;
                    if (curTop > 0) {
                        curTop = 0;
                    }
                    if (curTop < $('.location-map').height() - curZoom * locationMapHeight) {
                        curTop = $('.location-map').height() - curZoom * locationMapHeight;
                    }
                    mapStartX = e.originalEvent.touches[0].pageX;
                    mapStartY = e.originalEvent.touches[0].pageY;
                    $('.location-map-img').css({'transform': 'translate(' + curLeft + 'px, ' + curTop + 'px)'});
                    $('.location-map-img').data('curLeft', curLeft);
                    $('.location-map-img').data('curTop', curTop);
                }
                e.preventDefault();
            });

            $(document).on('touchend', function(e) {
                mapDrag = false;
            });
        }
    });

    $('body').on('click', '.main-select-menu-item a', function(e) {
        var curItem = $(this).parent();
        if (!curItem.hasClass('active')) {
            $('.main-select-menu-item.active').removeClass('active');
            curItem.addClass('active');

            var curIndex = $('.main-select-menu-item').index(curItem);
            $('.main-select-tab.active').removeClass('active');
            $('.main-select-tab').eq(curIndex).addClass('active');
            if ($('.main-select-menu').hasClass('swiper-initialized') && mainSelectMenuSwiper) {
                mainSelectMenuSwiper.slideTo(curIndex);
            }
        }
        e.preventDefault();
    });

    $('.main-select').each(function() {
        var curBlock = $(this);
        $.ajax({
            type: 'POST',
            url: curBlock.attr('data-url'),
            processData: false,
            contentType: false,
            dataType: 'html',
            cache: false
        }).done(function(html) {
            $('.select-data').html($(html).find('.building-data').html());
            var newData = [];
            if (typeof(dataSelect) != 'undefined') {
                for (var i = 0; i < dataSelect.buildings.length; i++) {
                    var curBuild = dataSelect.buildings[i];
                    for (var j = 0; j < curBuild.floors.length; j++) {
                        var curFloor = curBuild.floors[j];
                        for (var k = 0; k < curFloor.flats.length; k++) {
                            var curFlat = curFloor.flats[k];
                            curFlat.build = curBuild.id;
                            curFlat.floor = curFloor.number;
                            if (typeof(curFlat.mainpage) != 'undefined' && curFlat.mainpage) {
                                newData.push(curFlat);
                            }
                        }
                    }
                }
            }
            
            if (newData.length > 0) {
                var menuTitlesTexts = $('.main-select-menu').attr('data-titles').split(',');
                var menuTitles = [];
                for (var i = 0; i < menuTitlesTexts.length; i++) {
                    menuTitles.push(menuTitlesTexts[i].split(':'));
                }
                var menuItems = [];
                for (var i = 0; i < newData.length; i++) {
                    var curRooms = newData[i].rooms;
                    for (var j = 0; j < menuTitles.length; j++) {
                        if (curRooms == menuTitles[j][0]) {
                            var hasItem = false;
                            for (var k = 0; k < menuItems.length; k++) {
                                if (curRooms == menuItems[k][0]) {
                                    hasItem = true;
                                }
                            }
                            if (!hasItem) {
                                menuItems.push(menuTitles[j]);
                            }
                        }
                    }
                }
                menuItems.sort(function(a, b) {
                    var curA = Number(a[0]);
                    if (Number.isNaN(curA)) {
                        curA = -Infinity;
                    }
                    var curB = Number(b[0]);
                    if (Number.isNaN(curB)) {
                        curB = -Infinity;
                    }
                    if (curA > curB) return 1;
                    if (curA == curB) return 0;
                    if (curA < curB) return -1;
                });
                
                for (var i = 0; i < menuItems.length; i++) {
                    var curRoom = menuItems[i][0];
                    var curMin = Infinity;
                    for (var j = 0; j < newData.length; j++) {
                        var curFlat = newData[j];
                        if (curFlat.rooms == curRoom) {
                            var flatSize = Number(String(curFlat.size).replace(',', '.'));
                            if (flatSize < curMin) {
                                curMin = flatSize;
                            }
                        }
                    }
                    menuItems[i][2] = curMin;
                }

                var menuHTML =  '';
                var tabsHTML =  '';
                var moreTitle = $('.main-select-tabs').attr('data-moretitle');
                for (var i = 0; i < menuItems.length; i++) {
                    menuHTML +=     '<div class="main-select-menu-item">' +
                                        '<a href="#">' +
                                            '<div class="main-select-menu-item-title">' + menuItems[i][1] + '</div>' +
                                            '<div class="main-select-menu-item-size">от ' + menuItems[i][2] + ' м<sup>2</sup></div>' +
                                        '</a>' +
                                    '</div>';

                    tabsHTML += '<div class="main-select-tab">' +
                                    '<div class="main-select-list swiper">' +
                                        '<div class="main-select-list-inner swiper-wrapper">';

                    for (var j = 0; j < newData.length; j++) {
                        var curFlat = newData[j];
                        if (curFlat.rooms == menuItems[i][0]) {
                            tabsHTML +=     '<div class="main-select-list-item swiper-slide">' +
                                                '<div class="main-select-list-item-scheme"><a href="' + curFlat.preview + '" data-fancybox><img src="' + curFlat.preview + '" alt=""></a></div>' +
                                                '<div class="main-select-list-item-bottom">' +
                                                    '<div class="main-select-list-item-bottom-inner">' +
                                                        '<div class="main-select-list-item-compass"><img src="' + curFlat.compass + '" alt=""></div>' +
                                                        '<div class="main-select-list-item-floor"><img src="' + curFlat.fscheme + '" alt=""></div>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div class="main-select-list-item-btn"><a href="' + curFlat.url + '" class="btn">' + moreTitle + '</a></div>' +
                                            '</div>';
                        }
                    }
                    tabsHTML +=         '</div>' +
                                        '<div class="main-select-list-ctrl">' +
                                            '<div class="swiper-button-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#swiper-prev"></use></svg></div>' +
                                            '<div class="swiper-pagination"></div>' +
                                            '<div class="swiper-button-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#swiper-next"></use></svg></div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';
                }
                $('.main-select-menu-inner').html(menuHTML);
                $('.main-select-tabs').html(tabsHTML);

                $('.main-select-menu-item').eq(0).addClass('active');
                $('.main-select-tab').eq(0).addClass('active');

                $('.main-select-list').each(function() {
                    var curSlider = $(this);
                    const swiper = new Swiper(curSlider[0], {
                        loop: true,
                        navigation: {
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        },
                        pagination: {
                            el: '.swiper-pagination',
                            clickable: true
                        }
                    });
                });
            }
        });
    });

    Fancybox.bind('[data-fancybox]');

    $('.select-params').each(function() {
        var curBlock = $(this);
        $.ajax({
            type: 'POST',
            url: curBlock.attr('data-url'),
            processData: false,
            contentType: false,
            dataType: 'html',
            cache: false
        }).done(function(html) {
            $('.select-data').html($(html).find('.building-data').html());
            if (typeof(dataSelect) != 'undefined') {
                for (var i = 0; i < dataSelect.buildings.length; i++) {
                    var curBuild = dataSelect.buildings[i];
                    for (var j = 0; j < curBuild.floors.length; j++) {
                        var curFloor = curBuild.floors[j];
                        for (var k = 0; k < curFloor.flats.length; k++) {
                            var curFlat = curFloor.flats[k];
                            curFlat.buildtitle = curBuild.title;
                            curFlat.floor = curFloor.number;
                        }
                    }
                }

                $('.select-filter-building input').each(function() {
                    var curCheckbox = $(this);
                    var curName = 'checkbox_' + curCheckbox.attr('name') + curCheckbox.val();
                    if (typeof $.cookie(curName) != 'undefined' && $.cookie(curName) == 'true') {
                        curCheckbox.prop('checked', true);
                        $('.select-filter-building-item[data-id="' + curCheckbox.val() + '"]').addClass('active');
                    }
                });

                $('.select-filter-group-checkboxes input').each(function() {
                    var curCheckbox = $(this);
                    var curName = 'checkbox_' + curCheckbox.attr('name') + curCheckbox.val();
                    if (typeof $.cookie(curName) != 'undefined' && $.cookie(curName) == 'true') {
                        curCheckbox.prop('checked', true);
                    }
                });

                $('.select-filter-group-sizes-input input').each(function() {
                    var curInput = $(this);
                    var curName = 'text_' + $(this).attr('name');
                    if (typeof $.cookie(curName) != 'undefined') {
                        curInput.val($.cookie(curName));
                        curInput.parent().find('span em').html(curInput.val());
                    }
                });

                updateSelectList();
            }
        });
    });

    $('.select-filter-building-item').click(function() {
        var curItem = $(this);
        curItem.toggleClass('active');
        $('.select-filter-building input[value="' + curItem.attr('data-id') + '"]').prop('checked', curItem.hasClass('active'));
    });

    $('.select-filter-building-item').each(function() {
        var curItem = $(this);
        if ($('.select-filter-building input[value="' + curItem.attr('data-id') + '"]').prop('checked')) {
            curItem.addClass('active');
        } else {
            curItem.removeClass('active');
        }
    });

    $('.select-filter-group-sizes-input input').each(function() {
        var curInput = $(this);
        curInput.parent().find('span em').html(curInput.val());
    });

    $('.select-filter-group-sizes-input input').keyup(function() {
        var curInput = $(this);
        curInput.parent().find('span em').html(curInput.val());
    });

    $('.select-filter-group-sizes-input input').attr('autocomplete', 'off');
    $('.select-filter-group-sizes-input input').mask('XZZ', {
        translation: {
            'X': {
                pattern: /[0-9]/
            },
            'Z': {
                pattern: /[0-9]/, optional: true
            }
        }
    });

    $('.select-filter-submit a').click(function(e) {
        updateSelectList();
        e.preventDefault();
    });

    $('.select-filter-clear a').click(function(e) {
        $('.select-filter-building-item').each(function() {
            var curItem = $(this);
            $('.select-filter-building input[value="' + curItem.attr('data-id') + '"]').prop('checked', false);
            curItem.removeClass('active');
        });
        $('.select-filter-group-checkboxes input').prop('checked', false);
        $('.select-filter-group-sizes-input input').each(function() {
            var curInput = $(this);
            curInput.val(curInput.attr('data-default'));
            curInput.parent().find('span em').html(curInput.val());
        });
        updateSelectList();
        e.preventDefault();
    });

    $('.select-list-more a').click(function(e) {
        var countVisible = $('.select-list-item.visible').length;
        countVisible += listSize;
        $('.select-list-item:lt(' + countVisible + ')').addClass('visible');
        if ($('.select-list-item:not(.visible)').length == 0) {
            $('.select-list-more').removeClass('visible');
        }
        e.preventDefault();
    });

    $('.select-filter-header-mobile-link a').click(function(e) {
        $('.select-filter').toggleClass('open');
        e.preventDefault();
    });

});

var listSize = 10;

function updateSelectList() {
    $('.select-filter-building input').each(function() {
        var curName = 'checkbox_' + $(this).attr('name') + $(this).val();
        if ($(this).prop('checked')) {
            $.cookie(curName, 'true', {expires: 365});
        } else {
            $.cookie(curName, 'false', {expires: 365});
        }
    });
    $('.select-filter-group-checkboxes input').each(function() {
        var curName = 'checkbox_' + $(this).attr('name') + $(this).val();
        if ($(this).prop('checked')) {
            $.cookie(curName, 'true', {expires: 365});
        } else {
            $.cookie(curName, 'false', {expires: 365});
        }
    });
    $('.select-filter-group-sizes-input input').each(function() {
        var curName = 'text_' + $(this).attr('name');
        $.cookie(curName, $(this).val(), {expires: 365});
    });

    var newData = [];
    if (typeof(dataSelect) != 'undefined') {
        for (var i = 0; i < dataSelect.buildings.length; i++) {
            var curBuild = dataSelect.buildings[i];
            if ($('.select-filter-building input:checked').length == 0 || $('.select-filter-building input[value="' + curBuild.id + '"]:checked').length == 1) {
                for (var j = 0; j < curBuild.floors.length; j++) {
                    for (var k = 0; k < curBuild.floors[j].flats.length; k++) {
                        var curFlat = curBuild.floors[j].flats[k];
                        if ($('.select-filter-group-checkboxes-rooms input:checked').length == 0 || $('.select-filter-group-checkboxes-rooms input[value="' + curFlat.rooms + '"]:checked').length == 1) {
                            var flatSize = Number(String(curFlat.size).replace(',', '.'));
                            var sizeCorrect = false;
                            var minSize = Number($('.select-filter-group-sizes-from').val());
                            var maxSize = Number($('.select-filter-group-sizes-to').val());
                            if (flatSize >= minSize && flatSize <= maxSize) {
                                sizeCorrect = true;
                            }

                            if (sizeCorrect) {
                                newData.push(curFlat);
                            }
                        }
                    }
                }
            }
        }
    }

    var htmlList = '';
    var titleBuild = $('.select-list-content').attr('data-titlebuild');
    var titleFloor = $('.select-list-content').attr('data-titlefloor');
    var titleFlat = $('.select-list-content').attr('data-titleflat');
    var titleRoom = $('.select-list-content').attr('data-titleroom');
    var titleSize = $('.select-list-content').attr('data-titlesize');
    for (var i = 0; i < newData.length; i++) {
        var curFlat = newData[i];
        htmlList += '<a href="' + curFlat.url + '" class="select-list-item">' +
                        '<div class="select-list-item-scheme"><img src="' + curFlat.preview + '" alt=""></div>' +
                        '<div class="select-list-item-params">' +
                            '<div class="select-list-item-param build"><span>' + titleBuild + '</span>' + curFlat.buildtitle + '</div>' +
                            '<div class="select-list-item-param floor"><span>' + titleFloor + '</span> ' + curFlat.floor + '</div>' +
                            '<div class="select-list-item-param flat"><span>' + titleFlat + '</span> ' + curFlat.number + '</div>' +
                            '<div class="select-list-item-param room"><span>' + titleRoom + '</span> ' + curFlat.rooms + '</div>' +
                            '<div class="select-list-item-param size"><span>' + titleSize + '</span> ' + curFlat.size + ' м<sup>2</sup></div>' +
                        '</div>' +
                    '</a>';
    }

    $('.select-list-content').html(htmlList);
    $('.select-list-item:lt(' + listSize + ')').addClass('visible');
    if ($('.select-list-item:not(.visible)').length == 0) {
        $('.select-list-more').removeClass('visible');
    } else {
        $('.select-list-more').addClass('visible');
    }
}

function initForm(curForm) {
    curForm.find('input.phoneRU').attr('autocomplete', 'off');
    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    curForm.find('input.phoneRU').focus(function() {
        if ($(this).val() == '') {
            $(this).val('+7 (');
        }
    });


    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);

            if (curForm.hasClass('ajax-form')) {
                curForm.addClass('loading');
                var formData = new FormData(form);

                $.ajax({
                    type: 'POST',
                    url: curForm.attr('attr-action'),
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: formData,
                    cache: false
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    curForm.parent().append('<div class="window-success-title">Сервис временно недоступен, попробуйте позже.</div><div class="window-success-btn"><a href="#" class="btn window-close-btn">Продолжить знакомство</a></div>');
                    curForm.remove();
                }).done(function(data) {
                    curForm.parent().append('<div class="window-success-title">' + data.message + '</div><div class="window-success-btn"><a href="#" class="btn window-close-btn">Продолжить знакомство</a></div>');
                    curForm.remove();
                });
            } else {
                form.submit();
            }
        }
    });
}

$(window).on('load', function() {
    if (window.location.hash != '') {
        var curBlock = $('[data-id="' + window.location.hash.replace('#', '') + '"]');
        if (curBlock.length == 1) {
            $('html, body').animate({'scrollTop': curBlock.offset().top});
        }
    }
});

function windowOpen(linkWindow, dataWindow) {
    if ($('.window').length == 0) {
        var curPadding = $('.wrapper').width();
        var curWidth = $(window).width();
        if (curWidth < 390) {
            curWidth = 390;
        }
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'padding-right': curPadding + 'px'});

        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);
    } else {
        $('.window').append('<div class="window-loading"></div>')
        $('.window-container').addClass('window-container-preload');
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        processData: false,
        contentType: false,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window-container').length == 0) {
            $('.window').html('<div class="window-container window-container-preload">' + html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a></div>');
        } else {
            $('.window-container').html(html + '<a href="#" class="window-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#window-close"></use></svg></a>');
            $('.window .window-loading').remove();
        }

        window.setTimeout(function() {
            $('.window-container-preload').removeClass('window-container-preload');
        }, 100);

        $('.window form').each(function() {
            initForm($(this));
            var windowLink = $('.window-link.last-active');
            if (windowLink.length == 1 && typeof windowLink.attr('data-hiddenname') != 'undefined' && typeof windowLink.attr('data-hiddenvalue') != 'undefined') {
                $(this).append('<input type="hidden" name="' + windowLink.attr('data-hiddenname') + '" value="' + windowLink.attr('data-hiddenvalue') + '">');
            }
        });

    });
}

function windowClose() {
    if ($('.window').length > 0) {

        var isEmptyForm = true;
        $('.window .form-input input').each(function() {
            if ($(this).val() != '') {
                isEmptyForm = false;
            }
        });
        if (isEmptyForm) {
            $('.window-container').addClass('window-container-preload');
            $('.window').remove();
            $('html').removeClass('window-open');
            $('body').css({'padding-right': 0});
            $('.wrapper').css({'top': 0});
            $('meta[name="viewport"]').attr('content', 'width=device-width');
            $(window).scrollTop($('.wrapper').data('curScroll'));
        } else {
            if (confirm('Закрыть форму?')) {
                $('.window .form-input input').val('');
                windowClose();
            }
        }
    }
}

var mainSelectMenuSwiper;

$(window).on('load resize', function() {
    if ($(window).width() > 1199) {
        if ($('.main-select-menu').length > 0) {
            var curSlider = $('.main-select-menu');
            if (curSlider.hasClass('swiper-initialized') && mainSelectMenuSwiper) {
                mainSelectMenuSwiper.destroy();
                curSlider.removeClass('swiper');
                curSlider.find('.main-select-menu-inner').removeClass('swiper-wrapper');
                curSlider.find('.main-select-menu-item').removeClass('swiper-slide');
            }
        }
    } else {
        if ($('.main-select-menu').length > 0) {
            var curSlider = $('.main-select-menu');
            if (!curSlider.hasClass('swiper-initialized')) {
                curSlider.addClass('swiper');
                curSlider.find('.main-select-menu-inner').addClass('swiper-wrapper');
                curSlider.find('.main-select-menu-item').addClass('swiper-slide');
                curSlider.find('.main-select-menu-item a').eq(0).trigger('click');
                mainSelectMenuSwiper = new Swiper(curSlider[0], {
                    slidesPerView: 'auto',
                    centeredSlides: true,
                    on: {
                        slideChange: function () {
                            curSlider.find('.main-select-menu-item a').eq(mainSelectMenuSwiper.activeIndex).trigger('click');
                        },
                    },
                });
            }
        }
    }
});