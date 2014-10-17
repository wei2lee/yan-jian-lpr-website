$(document).ready(function () {

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
                        buttons:{
                            'Close':{
                                callback:function(){ bootbox.hideAll(); }
                            }
                        }
                    });
                    $bv.resetForm(false);
                    return;
                }
                $bb = bootbox.dialog({
                    closeButton: false,
                    message: 'The registration is successed.',
                    buttons:{
                        'Close':{
                            callback:function(){
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
                    buttons:{
                        'Close':{
                            callback:function(){ bootbox.hideAll(); }
                        }
                    }
                });
                $bv.resetForm(false);
            });
        }).on('error.field.bv', function (e, data) {}).on('success.field.bv', function (e, data) {});
        $('.form-register-1 [type=reset]').click(function(){
            $('.form-register-1').data('bootstrapValidator').resetForm();
        });

    }

});