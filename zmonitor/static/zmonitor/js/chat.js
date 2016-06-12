$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var chatsock = new WebSocket(ws_scheme + '://' + window.location.host + window.location.pathname);

    chatsock.onmessage = function(message) {
        console.log('Recv')
        var data = JSON.parse(message.data);
        var chat = $("#chat")
        var ele = $('<tr></tr>')

        ele.append(
            $("<td></td>").text(data.timestamp)
        )
        ele.append(
            $("<td></td>").text(data.user)
        )
        ele.append(
            $("<td></td>").text(data.message)
        )

        chat.append(ele)
    };

    $("#chatform").on("submit", function(event) {
        console.log('Sent')
        var message = {
            message: $('#message').val(),
        }
        chatsock.send(JSON.stringify(message));
        $("#message").val('').focus();
        return false;
    });
})
