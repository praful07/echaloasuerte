var SharedDrawCreator = {};

SharedDrawCreator.show_general_step = function () {
    SharedDrawCreator.update_breadcrumb('general');
    $('.step-configure').toggleClass('hidden', true);
    $('.step-invite').toggleClass('hidden', true);
    $('.step-general').toggleClass('hidden', false);
};

SharedDrawCreator.show_configure_step = function () {
    SharedDrawCreator.update_breadcrumb('configure');

    // Copy the draw's title to the resizable input
    var draw_title = $('#draw-title').val();
    var $draw_title_resizable = $('#draw-title-container').find("[name='title']");
    $draw_title_resizable.val(draw_title);

    $('.step-general').toggleClass('hidden', true);
    $('.step-invite').toggleClass('hidden', true);
    $('.step-configure').toggleClass('hidden', false);

    // Once shown, trigger 'blur' event to force resizing
    $draw_title_resizable.blur();
};

SharedDrawCreator.show_invite_step = function () {
    SharedDrawCreator.update_breadcrumb('invite');
    $('.step-general').toggleClass('hidden', true);
    $('.step-configure').toggleClass('hidden', true);
    $('.step-invite').toggleClass('hidden', false);
};


// Updates the breadcrumb to show the steps that have been already done
SharedDrawCreator.update_breadcrumb = function (target_step){
    var $label_general = $('.breadcrumb-shared-draw #general');
    var $label_configure = $('.breadcrumb-shared-draw #configure');
    var $label_invite = $('.breadcrumb-shared-draw #invite');

    if (target_step == "invite"){

        $label_configure.toggleClass('focus', false);

        $label_invite.toggleClass('focus', true);
        $label_invite.toggleClass('done', true);
        $('.breadcrumb-shared-draw').attr('data-current-step', 'invite');
    }
    else{
        if (target_step == "configure"){
            $label_general.toggleClass('focus', false);
            $label_configure.toggleClass('done', true);
            $label_configure.toggleClass('focus', true);
            $('.breadcrumb-shared-draw').attr('data-current-step', 'configure');
        }
        else{
            if (target_step == "general"){
                $label_general.toggleClass('focus', true);
                $label_configure.toggleClass('focus', false);
                $label_invite.toggleClass('focus', false);
                $('.breadcrumb-shared-draw').attr('data-current-step', 'general');
            }
        }
    }
};

// Initialize the interface for a shared draw
SharedDrawCreator.setup = function(){
    $('#btn-configure').click(function () {
        // Validate title and description
        SharedDrawCreator.show_configure_step();
    });
};
