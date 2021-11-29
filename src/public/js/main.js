$(function () {
  const socket = io();

  //obtaining DOM elements from contentWrap
  const $messageForm = $("#message-form");
  const $messageBox = $("#message");
  const $chat = $("#chat");
  const $users = $("#usernames");

  //obtaining DOM elements from the nickWrap
  const $nickForm = $("#nickForm");
  const $nickError = $("#nickError");
  const $nickname = $("#nickname");

  $nickForm.submit((e) => {
    e.preventDefault();
    socket.emit("new user", $nickname.val(), (data) => {
      if (data) {
        $("#nickWrap").hide();
        $("#contentWrap").show();
      } else {
        $nickError.html(`
      <div class="alert alert-danger">
        Error: That username already exists or it has more than one word.
      </div>
      `);
      }
    });
    $nickname.val("");
  });

  //events
  $messageForm.submit((e) => {
    e.preventDefault();
    socket.emit("send message", $messageBox.val(), (data) => {
      $chat.append(`<p class="error">${data}</p>`);
    });
    $messageBox.val("");
  });
  socket.on("new message", (data) => {
    displayMsg(data);
  });
  socket.on("usernames", (data) => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
      html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`;
    }
    $users.html(html);
  });
  socket.on("whisper", (data) => {
    $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
  });
  socket.on("load old msgs", (msgs) => {
    for (let i = msgs.length - 1; i >= 0; --i) {
      displayMsg(msgs[i]);
    }
  });

  function displayMsg(data) {
    $chat.append("<b>" + data.nick + "</b>: " + data.msg + "<br/>");
  }
});
