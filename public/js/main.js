var _conn;
var url_string = window.location.href;
var url = new URL(url_string);
var peer_id = url.searchParams.get("peer_id");
var my_id = makeid(12);
var peer = new Peer(my_id);
var messagebox = document.getElementById("messagebox");

//if chat id is present, the session fired is a client.
if (peer_id != null) {
  snack("Connecting...");
  console.log(peer_id);
  document.getElementById("invite-button").style.display = "none";
  setTimeout(() => {
    _conn = peer.connect(peer_id);
    console.log(_conn);
    // on open will be launch when you successfully connect to PeerServer
    _conn.on("open", function () {
      console.log("connection opened!");
      snack("Connected.");
      // here you have conn.id
      _conn.on("data", function (data) {
        document.getElementById("conversation").innerHTML +=
          "<div class='bubblewrap'><span class='receive-bubble'>" +
          data +
          "</span></div>";
        console.log(data);
      });
    });
  }, 2000);
} else {
  peer.on("connection", function (conn) {
    document.getElementById("invite-button").style.display = "none";
    _conn = conn;
    console.log("connection");
    snack("Your invite has been accepted.");
    _conn.on("data", function (data) {
      document.getElementById("conversation").innerHTML +=
        "<div class='bubblewrap'><span class='receive-bubble'>" +
        data +
        "</span></div>";
      console.log(data);
    });
  });
}

document.getElementById("invite-button").addEventListener("click", function () {
  copy_to_clipboard(window.location.href + "?peer_id=" + my_id);
});
document.getElementById("send-button").addEventListener("click", function () {
  if (document.getElementById("messagebox").value != "") {
    _conn.send(document.getElementById("messagebox").value);
    document.getElementById("conversation").innerHTML +=
      "<div class='bubblewrap'><span class='send-bubble'>" +
      document.getElementById("messagebox").value +
      "</span></div>";
    document.getElementById("messagebox").value = "";
  }
});

//send message on enter key press
messagebox.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("send-button").click();
  }
});

//UTILS
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function copy_to_clipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  snack("Invite Link copied!");
}

function snack(text) {
  var x = document.getElementById("snackbar");
  if (x.className != "show") {
    x.innerHTML = text;
    x.className = "show";
  } else {
    x.innerHTML = text;
  }
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
