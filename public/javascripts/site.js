(function($){
    $(function(){
        $('.additional-info-msg, .toggle-additional-info').click(function(){
            $('.additional-info-wrap').slideToggle();
        });

        if( $('.reminder-selector').length > 0){
            var reminder_selector = $('.reminder-selector');
            $('.reminder-content[data-id="' + reminder_selector.val() + '"]').show();
            reminder_selector.change(function(){
                $('.reminder-content').not('[data-id="' + reminder_selector.val() + '"]').hide();
                $('.reminder-content').filter('[data-id="' + reminder_selector.val() + '"]').show();
            });
        }

        if($('.registration-form').length > 0){
            var cityListContainer = $('.city-list-container');
            var items = $('.city-list li');
            items.click(function(){
                $('#city').val($(this).text().trim());
                cityListContainer.slideUp();
            })
            $('#city').on('input', function ($event){
                var t = $(this);
                if (t.val() == ''){
                    cityListContainer.hide();
                }else{
                    cityListContainer.show();
                }
                items.addClass('filtered-out').filter(function (item){
                    return $(this).text().toLowerCase().includes($($event.target).val().toLowerCase());
                }).removeClass('filtered-out');
            });
            $('.btn-edit').click(function(){
                var t = $(this);
                t.parents('.registration-form').find('input, button').not(t).prop('disabled', t.hasClass('cancel'));
                t.toggleClass('cancel');
                t.hasClass('cancel') ? t.text('בטל') : t.text('ערוך');
            });
            $('.registration-form').validate_forms();
        }
        if($('.scInserts').length > 0){
            $('.scInserts .btn').click(function(){
                var action = $(this).data('action'), addStr = '';
                switch (action){
                    case 'addLocation':
                        addStr = '<*location*>';
                        break;
                    case 'addNumber':
                        addStr = '<*number*>';
                        break;
                    case 'addType':
                        addStr = '<*type*>';
                        break;
                    case 'addName':
                        addStr = '<*name*>';
                        break;
                }
                $('#content').text($('#content').text() + addStr);
            });
        }
    });
})(jQuery);