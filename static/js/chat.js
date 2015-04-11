;(function ($) {

    // Set the defaults
    var pluginName = 'EASchat',
        defaults = {
            url_send_message: "",
            url_get_messages: "",
            draw_id: ""
        };

    /*********************************
     *     CHAT CLASS DEFINITION
     ********************************/
    var Chat = function (element, options){
        this.init(element, options);
    };

    Chat.prototype = {

        constructor: Chat,

        init: function (element, options){
            var that = this;
            this.$element = $(element)
            this.options = $.extend( {}, defaults, options) ;

            this.$element.removeClass("hidden");

            // Toggle chat when click on it header
            this.$element.find('.panel-heading').click(function (){
                console.log('collapsed '+$(this).parent());
                that.$element.find(".panel-body").toggle(150);
            });


            // Submit message when click on "Send" button
            this.$element.find('#chat-send').click(function () {
                    console.log('send msg');
                    var message = that.get_message_and_clean();
                    that.submit_message(message);
                }
            );

            // Submit message when the "enter" key is pressed
            this.$element.find("#chat-message-box").keyup(function (e) {
               if(e.keyCode == 13) {
                   var message = that.get_message_and_clean();
                   that.submit_message(message);
               }
            });

            // Auto refresh the chat against the server
            (function start_auto_refresh () {
                that.get_messages();
                setTimeout(start_auto_refresh,5000);
             })();
        },

        // Return the message from the chat input box and clean it
        get_message_and_clean: function (){
            var $message_input = this.$element.find("#chat-message-box");
            var message = $message_input.val();
            $message_input.val("");
            return message;
        },

        // Submit the parameter "message" to the server
        submit_message: function (message) {
            // Check empty string
            if(!message || /^\s*$/.test(message)){
                return;
            }

            $.ajax({
                url : this.options.url_send_message,
                method : "GET",
                data: {
                    draw_id : this.options.draw_id,
                    message : message
                }
            });
        },

        // Get all the messages of a public draw and refresh the chat board
        get_messages: function (){
            var that = this;
            var $chat = this.$element.find("#chat-board");
            $.ajax({
                url : this.options.url_get_messages,
                method : "GET",
                data: { draw_id : this.options.draw_id},
                success : function(data){
                    $chat.html("");
                    var arr = data.messages;
                    for (var i = 0, length = arr.length; i < length; i++) {
                      var element = arr[i];
                      var entry = that.formatChatEntry(element);
                      $chat.append(entry);
                    }
                }
            });

        },

        // Given a chat entry generates and returns the html code necessarry to be rendered
        formatChatEntry: function (chat_entry){
            var user = chat_entry.user;
            var content = chat_entry.content;
            var time = chat_entry.creation_time;
            var html = '<li class="right clearfix"><span class="chat-img pull-right">' +
                '    <img src="http://placehold.it/50/FA6F57/fff&text=' + user.toUpperCase().charAt(0) + '" alt="User Avatar" class="img-circle" />' +
                '</span>' +
                '    <div class="chat-line clearfix">' +
                '        <div class="header">' +
                '            <small class=" text-muted"><i class="fa fa-clock-o"></i> ' + time + '</small>' +
                '            <strong class="pull-right primary-font">' + user + '</strong>' +
                '        </div>' +
                '        <p>' + content + '</p>' +
                '    </div>' +
                '</li>';

            return html;
}
    };

    /*********************************
     *     CHAT PLUGIN DEFINITION
     ********************************/
    $.fn.chat = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Chat( this, options ));
            }
        });
    };
})(window.jQuery, window, document );



