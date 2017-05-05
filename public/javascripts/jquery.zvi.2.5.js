/////////////////////////////////////////////////////////////////////////////
console = (typeof (console) == "object" ? console : null);
isEditMode = (typeof (isEditMode) == "boolean" ? isEditMode : false);
myip = (typeof (myip) == "boolean" ? myip : false);
jQuery = (typeof (jQuery) != "undefined" ? jQuery : null);
$ = jQuery;
/////////////////////////////////////////////////////////////////////////////

String.prototype.testRegx = function(pattern) {
    var rgx = new RegExp(eval('/' + pattern + '/gmi'));
    return rgx.test(this);
}

String.prototype.replaceRegx = function(pattern, replaceWithTxt) {
    var rgx = new RegExp(eval('/' + pattern + '/gmi'));
    return this.replace(rgx, replaceWithTxt);
}

String.prototype.lettersLength = function(chr) {
    return this.replace(RegExp('[^' + (chr || 'a-z') + ']', 'gi'), '').length;
}

String.prototype.getQsParam = function(params) {
    var v = this.replaceRegx('^(.*?(^|\\?|&|#)(' + params + ')=)(.*?)(&|$|#).*?$', '$4');
    return (v!=this ? v : ''); // אם הפרמטר לא נמצא שלא יחזיר את כל המחרוזת
}

String.prototype.removeQsParam = function(params) {
    return this.replaceRegx('(^|(\\?|#)|&)(' + params + ')=.*?(?=(&|$|#))', '$2').replace(/(^|\?)&/g, '$1')
}

String.prototype.yt_id = function() {
    if (this.match(/\?v=/))
        return this.replace(/^(.*?(^|\?|\&)v=)(.*?)(?=(&|$)).*?$/gi, '$3');
    else if (this.match('/'))
        return this.replace(/^(.*\/)(.*?)(?=$).*?$/gi, '$2');
    return '';
}

String.prototype.get_year = function() {
    return this.replace(/.*(\d{4}).*/g, '$1'); // שולף מס' בן 4 ספרות
}

String.prototype.cleanHTML = function()
{
	var txt=this;

	txt = txt.replace(/&nbsp;/g,' '); // מחליף רווחים לרווחים
    txt = txt.replace(/(<style\b[^>]*>(.|\n)*?<\/style>)|(<!\--(.|\n)*?-->)/gmi,''); // מסיר הערות ותגי style - (multiline)
    txt = txt.replace(/<\/?(i|span|a|sup)\b[^>]*>/g,''); // מנקה את התגים שבסוגריים
    txt = txt.replace(/(<[^>]*>)|(&.+?;)/g,' '); // מחליף את כל שאר התגים ברווחים

    return txt;
}

String.prototype.left = function(num) {
    return this.substring(0, num);
}

String.prototype.right = function(num) {
    return this.substring(this.length - num, this.length);
}

function roundedToFixed(_float, _digits) {
    var rounder = Math.pow(10, _digits);
    return (Math.round(_float * rounder) / rounder).toFixed(_digits);
}

function digits_only(d) {
    return ((d >= 48 && d <= 57) || (d >= 96 && d <= 105) || d == 8 || d == 9 || d == 16 || d == 46 || (d >= 35 && d <= 39) || d == 13);
}

function MASK_(text) {
    if (typeof (text) != 'string')
        return "";

    text = $.trim(text.replace(/[^\s\d\w\-\_\/\&\@\.\)\(]/gm, ''));
    return text.replace(/\s/g, '_');
}

function is_valid_prefix(txt) {
    var RX = /^\+?[0-9]{1,3}$/;
    return (RX.test(txt));
}

function is_valid_phone(txt, phone_type) {
    if (phone_type == 'no_prefix')
        var RX = /^[2-9][0-9]{6}$/;
    else if (phone_type == 'with_prefix')
        var RX = /^0(2|3|4|8|9|([5-7][0-9]))(\-)?([2-9])[0-9]{6}$/;
    else
        var RX = /^\+?[0-9\-]{7,}$/;
    return (RX.test(txt));
}

function is_valid_email(txt) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(txt);
}
function is_valid_id_number(txt) {
    var regex = /^[0-9]{9}$/;
    return regex.test(txt);
}

function progress_icon() {
    var img = $('<img src="/images/progress_icon.gif" class="progress_icon" />');
    img.css({
        'top': ($(window).height() / 2 - 16 + $(window).scrollTop()) + 'px',
        'left': $(window).width() / 2 - 16 + 'px',
        'position': 'absolute'
    });
    img.appendTo($('body'));
    return img;
}

function trimHTML(html) {
    if (!html)
        return '';

    var linebreak = '(<br\\s*\/*>)', space = '((&nbsp;)|(\\s)|' + linebreak + ')'; // מגדיר ירידות שורה ורווחים ב HTML
    html = html.replace(RegExp('(^|' + linebreak + ')' + space + '+', 'g'), '$1'); // מוריד רווחים בתחילת שורה
    html = html.replace(RegExp(space + '+(' + linebreak + '|$)', 'g'), '$1'); // מוריד רווחים בסוף שורה
    html = html.replace(RegExp(linebreak + '+$', 'g'), ''); // מוריד ירידות שורה בסוף
    return html;
}

if (jQuery) (function($) {

    $.fn.scroll_to = function(speed, shift, smart_mode) {
        if (!this.length)
            return this;

        speed = ((typeof (speed) == "number") ? speed : 150);
        shift = ((typeof (shift) == "number") ? shift : 50);
        smart_mode = ((typeof (smart_mode) == "boolean") ? smart_mode : false);

        var st = $(window).scrollTop(), target_st = this.offset().top - shift;

        if ((!smart_mode) || st > target_st || target_st - st > $(window).height() / 2)
            $('html, body').animate({ scrollTop: target_st }, speed);

        return this;
    };

    $.fn.maxHeight = function() {

        var max = 0;

        this.each(function() {
            max = Math.max(max, $(this).height());
        });

        return max;
    };

    $.fn.maxWidth = function() {

        var max = 0;

        this.each(function() {
            max = Math.max(max, $(this).width());
        });

        return max;
    };

    $.fn.setMaxHeight = function(selector) {
        if (!this.length)
            return this;

        var li = selector ? this.find(selector) : this.children(), last_top = -1;

        li.each(function() {
            var top = $(this).position().top;

            if (top > last_top) {
                var pli = li.filter(function(index) {
                    return $(this).position().top == top;
                });
                pli.height(pli.maxHeight());
            }

            last_top = top;
        });
        return (this);
    };

    $.fn.setMaxWidth = function() {
        this.width(this.maxWidth());
        return this;
    };

    $.fn.cleanAttributesHTML = function() {
        if (!this.length)
            return this;
        this.find('*').each(function() {
            var t = $(this);
            var attr, attributes = ['title', 'alt'];
            for (i in attributes) {
                attr = attributes[i];
                if (t.attr(attr))
                    t.attr(attr, t.attr(attr).cleanHTML());
            }
        });
        return this;
    };

    $.fn.enable_visible = function () {

        if (this.length > 1) return this.each(function () {
            $(this).enable_visible();
        });

        if ((!this.length) || this.is('[type="hidden"]'))
            return this;
        
        var selector = 'input, select, textarea';
        if (this.is(selector) && this.is(':visible')) {
            //console.log('name: ', this.attr('name'));
            this.prop('disabled', false);
        }
        else
            this.find(selector).enable_visible();

        return (this);
    }

    $.fn.disabled = function (bool) {
        if (!this.length)
            return this;
        bool = ((typeof (bool) != 'undefined') ? bool : !this.is(':visible'));

        var selector = 'input, select, textarea';
        if (this.is(selector))
            this.prop('disabled', bool);
        else
            this.find(selector).prop('disabled', bool);

        return (this);
    }

    $.fn.read_only = function(bool) {
        if (!this.length)
            return this;
        this.find('input[type="text"], [type="password"], [type="tel"], [type="email"], textarea').prop('readonly', bool);
        this.find(':radio:not(:checked), option:not(:selected)').prop('disabled', bool);
        if (bool)
            this.find(':radio, input[type="button"]').unbind('click');

        if (typeof (zebra_update) == 'function')
            zebra_update();

        return (this);
    }

    $.fn.validate_forms = function(success_function) {

        return this.each(function() {
            var frm = $(this), success_f = success_function;

            if (frm.hasClass('validate_forms_d'))
                return frm;
            frm.addClass('validate_forms_d');

            if (typeof success_f != 'function')
                success_f = frm.data('success_function');

            frm.find('[data-label]').each(function() {
                var t = $(this);
                if ($.trim(t.val()) == '') t.val($(this).data('label'));
            }).focus(function() {
                var t = $(this);
                if ($.trim(t.val()) == t.data('label'))
                    t.val('');
            }).blur(function() {
                var t = $(this);
                if ($.trim(t.val()) == '') t.val($(this).data('label'));
            });

            frm.find('.req').bind('blur change', function(e) {
                var t = $(this);
                frm.removeClass('form_submited');
                t.validate_field(e);
                t.removeClass('submit-alert');
                t.nextAll('.bubble').attr({ 'role': 'tooltip', 'aria-live': '' }).find('.alert-ext').empty();
            }).focus(function() {
                $(this).removeClass('not_valid').next('.req_msg').hide();
            });

            frm.on('keydown', '.digits_only.req', function(e) {
                if (!digits_only(e.keyCode))
                    e.preventDefault();
            });

            frm.on('keydown', '[name="fname"].req, [name="f_name"].req, [name="l_name"].req', function(e) {
                var d = e.keyCode;
                if ((d >= 48 && d <= 57) || (d >= 96 && d <= 105))
                    e.preventDefault();
            });

            frm.find('[name="captcha"]').attr('autocomplete', 'off');
            if (typeof (create_captcha) == 'function')
                create_captcha(frm);

            frm.submit(function() {
                var frm = $(this), flag = true;

                if (frm.hasClass('form_submited'))
                    return false;

                frm.find('.req:visible').filter(':enabled, td[contenteditable="true"]').each(function () {
                    var t = $(this);
                    if (!t.validate_field()) {
                        if (console && myip)
                            console.log('req:', t);
                        if ($.fn.scroll_to && flag) { // אם זה הראשון
                            t.scroll_to();
                            if(!t.is('select')) t.focus();
                            t.addClass('submit-alert');
                            var b = t.nextAll('.bubble').attr({ 'role': 'alert', 'aria-live': 'assertive' }).find('.alert-ext');
                            b.html(b.data('txt'));
                        }
                        flag = false;
                    }
                });

                frm.find('.msg').toggleClass('show', !flag);

                if (flag) {
                    frm.addClass('form_submited');

                    var p = progress_icon();

                    if (typeof success_f == 'function')
                        var success_rt = success_f(frm);

                    if (frm.attr('method') == 'ajax') {
                        if (!success_f) {
                            $.post(frm.attr('action'), 'ajax=1&' + frm.serialize(), function(data) {
                                p.remove();
                                $('.before').fadeOut('fast', function() {
                                    $('.after').fadeIn('fast');
                                });
                            });
                        }
                        return false;
                    }
                    else {
                        if (frm.attr('target') == '_blank')
                            $('.before').fadeOut('fast', function() {
                                $('.after').fadeIn('fast');
                            });
                        if (typeof (success_rt) == 'boolean')
                            return success_rt;

                        return true;
                    }
                }
                return false;
            });

            return frm;
        });
    }

    $.fn.validate_field = function(e) {
        if (!this.length)
            return this;

        var t = this, flag = true;
        var name = t.attr('name'), type = (t.attr('type') ? t.attr('type') : t.prop('nodeName')).toLowerCase();
        var alert_msg = t.data('alert');

        switch (type) {
            case 'text': case 'password': case 'textarea': case 'tel': case 'email':
                var v = $.trim(t.val());
                var label = t.data('label');
                var pattern = t.data('pattern');

                if (name == 'fname' || name == 'f_name' || name == 'l_name')
                    t.val(v.replace(/\d/g, ''));

                if (label && v == '')
                    t.val(label);

                if (v == '')
                    $('.req_msg.' + name).removeClass('notvalid'); // notvalid with no underscore
                else {
                    $('.req_msg.' + name).addClass('notvalid'); // notvalid with no underscore
                    if (pattern)
                        flag = v.testRegx(pattern);
                    else if (name == 'phone' || name == 'cell' || name == 'cellphone')
                        flag = is_valid_phone(v, t.data('phone_type'));
                    else if (name == 'prefix')
                        flag = is_valid_prefix(v);
                    else if (name == 'email')
                        flag = is_valid_email(v);
                    else if (name.match('id_number'))
                        flag = is_valid_id_number(v);
                    else if (name == 'captcha') {
                        flag = false;
                        var cptcind = t.closest('form').find('[name="cptcind"]');
                        cptcind = (cptcind.length ? cptcind.val() : '');

                        $.ajax({
                            url: '/upload/include/captcha_check.asp?cptcind=' + cptcind + '&captcha=' + v,
                            async: false,
                            success: function(data) {
                                flag = eval(data);
                            }
                        });
                    }
                    else if (name == 'repassword') {
                        var pass = t.closest('form').find('[name="password"]');
                        flag = (v == pass.val() || !pass.length);
                    }
                }
                if (v == '' || v == label)
                    flag = false;
                break;
            case 'checkbox':
                flag = t.prop('checked');
                break;
            case 'radio':
                t = t.closest('form').find('input:radio[name="' + name + '"]');
                flag = !!t.filter(':checked').length;
                break;
            case 'select':
                var v = $.trim(t.val());
                flag = (v != '');
                break;
            case 'td':
                var v = trimHTML(t.html());
                flag = (v != '');
                break;
        }

		//////////////////////////////////////////////////////////////////////////////////
		//////////////// GOOGLE reCaptcha - CLIENT SIDE CHECK /////////////////////////////////////
		var $reCaptcha = $('.g-recaptcha');
		if ($reCaptcha.length > 0) {
			
			var $reCaptchaValidationField = $reCaptcha.parents('form').find('#g-recaptcha-response'), flag_captcha = false;
			$reCaptchaValidationField.val().length ? flag_captcha = true : flag_captcha = false;
			if (flag_captcha) {
				//$('.secureLbl').css('color', '');
				$reCaptcha.css('border', '');
			} else {
				//$('.secureLbl').css('color', '#f00');
				$reCaptcha.css('border', '1px solid #f00');
				//alert('יש לסמן V בתיבת האבטחה');
				$reCaptcha.focus();
				//flag  = flag_captcha;
			}
		}
		//////////////////////////////////////////////////////////////////////////////////

        t.toggleClass('not_valid', !flag);
        t.removeClass('submit-alert');
        t.nextAll('.bubble').attr({ 'role': 'tooltip', 'aria-live': '' }).find('.alert-ext').empty();
        if (t.parents('.ND').length) {
            $('.req_msg.' + name).css('visibility', flag ? 'hidden' : 'visible');
        } else
            $('.req_msg.' + name).toggle(!flag);
        t.attr('aria-invalid', (!flag).toString());
		
		if(flag && $reCaptcha.length > 0)flag  = flag_captcha;
		
        if (!flag && alert_msg) {
            alert(alert_msg);
            t.focus();
        }
        return flag;

    }

})(jQuery);


function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";

    if (document.cookie.indexOf(name) == -1) {
        alert("Cookies are Disabled!");
        return false;
    }
    return true;
}

function eraseCookie(name) {
    return createCookie(name, "", 90);
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
