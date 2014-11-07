var nav_height = 90;

$(document).ready(function () {
    window.requestAnimationFrame(function ( /* time */ time) {
        // time ~= +new Date // the unix time
        $(window).trigger('resize');
    });

    $(window).resize(onResize);

    function onResize() {
        var wh = $(window).height();
        $center = $('.center-container');
        $main = $('.main-container');
        var mh = $main.height();
        $sidebarright = $('.sidebar-right');
        var sbrh = $main.height();

        var h = Math.max(wh, mh, sbrh - nav_height);
        $center.css('min-height', h + 'px');
        $main.css('min-height', h + 'px');
        $sidebarright.css('min-height', (h + 0) + 'px');


        $('[data-scale-fit-width]').each(function (ind, ele) {
            var pw = Math.floor($(this).parent().width());
            var w = $(this).width();
            var s = pw / w;
            $(this).css({
                'transform-origin': '0 0',
                '-webkit-transform': 'scale(' + s + ')',
                '-ms-transform': 'scale(' + s + ')',
                'transform': 'scale(' + s + ')'
            });
        });
    }


    function onContentUnload($content) {

    }

    function onContentLoad($content, url) {
        if ($('.main-facilities').length) {
            $('.main-facilities').find(".fancybox").fancybox();
        }

        if ($('.main-floorplan').length) {
            $('a[data-type]').click(function () {
                var type = $(this).attr('data-type');
                $('.type-floor-plan').attr('src', 'img/floorplan-type-' + type + '.jpg');
                $('a[data-type]').each(function () {
                    $(this).toggleClass('selected', $(this).attr('data-type') == type);
                });
            });

            $('a[data-type=A]').trigger('click');
        }
        if ($('.main-location').length) {}
        if ($('.main-register').length) {
            i18n.init({
                    'lng': "en",
                    'useCookie': true,
                    'preload': ['zh-CN']
                },
                function (t) {
                    $('.select-lang [data-lang]').toggleClass('selected', false);
                    $('.select-lang [data-lang=en]').toggleClass('selected', true);
                    $('body').i18n();
                    init();
                }
            );

            function init() {
                var t = i18n.t;
                select2option1 = {
                    placeholder: t('please-select')
                };
                select2option2 = {
                    placeholder: t('please-select'),
                    minimumResultsForSearch: -1
                };
                $('select:not([disable-search])').select2(select2option1);
                $('select[disable-search]').select2(select2option2);

                $('.select-lang [data-lang]').click(function () {

                    var lng = $(this).attr('data-lang');
                    i18n.init({
                            'lng': lng,
                            'useCookie': true
                        },
                        function (t) {
                            $("select").each(function () {
                                $(this).attr("data-placeholder", t('please-select'));
                                var $select2 = $(this).data("select2");
                                $select2.setPlaceholder();
                            });

                            $('.select-lang [data-lang]').toggleClass('selected', false);
                            $('.select-lang [data-lang=' + lng + ']').toggleClass('selected', true);
                            $('body').i18n();
                            $('.form-register-1 .form-group').each(function () {
                                $req = $(this).find('input[required]');
                                if ($req.length) {
                                    $label = $(this).find('>label');
                                    $label.html($label.html() + ' *');
                                }
                            });
                        }
                    );
                });
                $('.date').datepicker({
                    endDate: new Date(),
                    startView: "decade",
                    autoclose: true,
                    format: "dd MM yyyy"
                });
                $('.form-register-1 .form-group').each(function () {
                    $req = $(this).find('input[required]');
                    if ($req.length) {
                        $label = $(this).find('>label');
                        $label.html($label.html() + ' *');
                    }
                });
                $('.form-register-1').bootstrapValidator({
                    feedbackIcons: {
                        valid: 'glyphicon glyphicon-ok',
                        invalid: 'glyphicon glyphicon-remove',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        name: {
                            validators: {
                                notEmpty: {
                                    message: function () {
                                        return i18n.t('warning-name-empty');
                                    }
                                }
                            }
                        },
                        email: {
                            validators: {
                                notEmpty: {
                                    message: 'The email address is required'
                                },
                                emailAddress: {
                                    message: 'The email address is not valid'
                                }
                            }
                        },
                        mobile: {
                            validators: {
                                notEmpty: {
                                    message: 'The mobile is required'
                                }
                            }
                        },
                        address: {
                            validators: {
                                notEmpty: {
                                    message: 'The email address is required'
                                }
                            }
                        },
                        'tnc-agreement': {
                            validators: {
                                choice: {
                                    min: 1,
                                    max: 1,
                                    message: 'You must agree the disclamer'
                                }
                            }
                        }
                    }
                }).on('error.form.bv', function (e) {}).on('success.form.bv', function (e) {
                    e.preventDefault();
                    var $form = $(e.target);
                    var $bv = $form.data('bootstrapValidator');
                    var $bb = bootbox.dialog({
                        closeButton: false,
                        message: 'Sending enquiry...'
                    });
                    $.ajax({
                        url: $form.attr('action'),
                        type: 'POST',
                        dataType: 'json',
                        data: $form.serialize(),
                    }).done(function (data, textStatus, jqXHR) {
                        if (data.error_exist) {
                            $bb = bootbox.dialog({
                                closeButton: false,
                                message: 'The registration is failed, please try again later.' + '<br>Following error is occurred:' + data.error_msg,
                                buttons: {
                                    'Close': {
                                        callback: function () {
                                            bootbox.hideAll();
                                        }
                                    }
                                }
                            });
                            $bv.resetForm(false);
                            return;
                        }
                        $bb = bootbox.dialog({
                            closeButton: false,
                            message: 'The registration is successed.',
                            buttons: {
                                'Close': {
                                    callback: function () {
                                        bootbox.hideAll();
                                        $form.trigger('reset');
                                        $bv.resetForm(true);
                                    }
                                }
                            }
                        });
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        $bb = bootbox.dialog({
                            closeButton: false,
                            message: 'The registration is failed, please try again later.' +
                                '<br>Following error is occurred : ' + errorThrown +
                                '<br>Server response : ' + jqXHR.responseText,
                            buttons: {
                                'Close': {
                                    callback: function () {
                                        bootbox.hideAll();
                                    }
                                }
                            }
                        });
                        $bv.resetForm(false);
                    });
                }).on('error.field.bv', function (e, data) {}).on('success.field.bv', function (e, data) {});
                $('.form-register-1 [type=reset]').click(function () {
                    $('.form-register-1').data('bootstrapValidator').resetForm();
                });

            }

        }
    }
    (function () {
        $.address.init(function (event) {
            processJqueryAddressEvent(event);
        }).bind('change', function (event) {
            processJqueryAddressEvent(event);
        });

        var lastEvent = null;
        var fetchingPage = 0;

        function processJqueryAddressEvent(event) {
            if (fetchingPage) return;
            if (lastEvent && lastEvent.value == event.value) return;
            var url = null;
            var dir = 'partials';
            var htmlext = '.html';
            var m = null;
            if (/^\/home/.test(event.value)) url = dir + '/home' + htmlext;
            if (/^\/location/.test(event.value)) url = dir + '/location' + htmlext;
            if (/^\/register/.test(event.value)) url = dir + '/register' + htmlext;
            if (/^\/contact/.test(event.value)) url = dir + '/contact' + htmlext;
            if (/^\/e-brochure/.test(event.value)) url = null;
            if (/^\/concept/.test(event.value)) url = dir + '/concept' + htmlext;
            if (m = /^\/facilities\/phase([1])/.exec(event.value)) {
                url = dir + '/facilities/phase' + m[1] + htmlext;
            }
            if (m = /^\/floorplan\/phase([1])/.exec(event.value)) {
                url = dir + '/floorplan/phase' + m[1] + htmlext;
            }
            if (m = /^\/siteplan\/phase([1])/.exec(event.value)) {
                url = dir + '/siteplan/phase' + m[1] + htmlext;
            }
            if (/^\/gallery/.test(event.value)) url = null;

            if (!url) return;

            lastEvent = event;
            fetchingPage = 1;
            $.ajax(url).done(function (data) {
                var $cnt = $('.center-container').children();
                $cnt.fadeOut(100, function () {

                });
                $('.center-container').empty();
                $newcnt = $(data);
                $newcnt.appendTo($('.center-container'));
                onContentLoad($newcnt);

                function togglelinks(pathNames) {
                    for (var i = 0; i < pathNames.length; i++) {
                        var path = '#/' + pathNames.slice(0, i + 1).join('/');
                        $('.navbar a, .sidebar-left a').each(function () {
                            console.log($(this).attr('href') + ',' + $(this).attr('data-href') + ',' + path);
                            var check = ($(this).attr('href') == path || $(this).attr('data-href') == path);
                            if (check) {
                                $(this).addClass('selected');
                            } else {
                                $(this).removeClass('selected');
                            }
                        });
                    }
                }
                togglelinks(event.pathNames);
                $(window).trigger('resize');
            }).always(function () {
                fetchingPage = 0;
            }).fail(function (jqXHR, textStatus, thrownError) {
                bootbox.alert('Change page is failed.<br>Status : ' + textStatus + '<br>Error : ' + thrownError);
            });
        }
    })();


    //post initial
    $(window).trigger('resize');
});