n = parseInt($('input[type="radio"]:checked').val());

let baslangic =
  ' <h1 id="level-title"> choose difficulty and<br><br> click anywhere to start</h1>' +
  '<div class="radio-container hersey">' +
  "<div>" +
  '<input type="radio" name="isaret_kutusu" id="isaret1" value="2"  data-num="0"/>' +
  '<label for="isaret1">2li</label>' +
  "</div>" +
  "  <div>" +
  '<input type="radio" name="isaret_kutusu" id="isaret2" value="3"  data-num="1"/>' +
  '<label for="isaret2">3lü</label>' +
  "</div>" +
  "<div>" +
  '<input type="radio" name="isaret_kutusu" id="isaret3" value="4"  data-num="2" />' +
  '<label for="isaret3">4lü</label>' +
  " </div>" +
  " </div>";

max = [];
max.push([0]);
max.push([0]);
max.push([0]);
var n;
$(".btn").hide();

$.ajax({
  type: "POST",
  url: "/oyun",
  data: {
    skors: max,
  },
  success: function (response) {
    console.log(response);
    max = response;
  },
  error: function (xhr, status, error) {
    console.log(error);
  },
});

gamePattern = [];
playerPattern = [];
var level = 0;
function buttonColours() {
  let colours = ["green", "red", "yellow", "blue"];
  return colours.slice(0, n + 1);
}

function nextSequence() {
  if (level != -1) {
    if (level == 0) {
      $.ajax({
        type: "POST",
        url: "/xial",
        data: {
          basamak: $("input[name='isaret_kutusu']:checked").data("num"),
        },
        success: function (response) {
          // max dizisini sayısal bir diziye dönüştürün
          console.log(response);
        },
        error: function (xhr, status, error) {
          console.log(error);
        },
      });
    }
    $(".isimd").hide();
    level++;
    $(".ilk").html("<h1 id='level-title'>Level:" + level.toString() + "</h1>");
    randomNumber = Math.floor(Math.random() * n);
    randomChosenColour = buttonColours()[randomNumber];
    elem = $("#" + randomChosenColour);
    var gameID = elem.attr("id");
    setTimeout(function () {
      gamePattern.push(gameID);
      console.log(gamePattern);
      currentBgColor = elem.css("backgroundColor");
      elem.fadeOut(100).fadeIn(100);
      audio = new Audio("/sounds/" + randomNumber + ".mp3");
      audio.play();
      playerPattern = [];
    }, 1000);
    return false;
  }
}
$(".btn").click(function () {
  if (level >= 0) {
    $(".isimd").hide();
    var buttonId = $(this).attr("id");
    audio = new Audio("/sounds/" + $(this).data("value") + ".mp3");
    audio.play();
    playerPattern.push(buttonId);
    $(this).addClass("pressed");
    btn = $(this);
    console.log(playerPattern);
    setTimeout(function () {
      btn.removeClass("pressed");
      kontrol();
    }, 100);
  }
  return false;
});

function kontrol() {
  for (let i = 0; i < playerPattern.length; i++) {
    if (playerPattern[i] !== gamePattern[i]) {
      zirveKontrol();
      bitti();
    }
  }
  if (playerPattern.length === gamePattern.length) {
    setTimeout(function () {
      nextSequence();
    }, 100); // 1 saniye bekleme süresi
  }
  return true;
}

$("input[type='radio']").change(function () {
  $(".btn").show();
  // radio elemanının checked durumu değiştiğinde burada çalışacak kodlar yer alabilir
  $.ajax({
    type: "POST",
    url: "/zirvedeki",
    data: {
      zorluk: $("input[name='isaret_kutusu']:checked").data("num"),
    },
    success: function (response) {
      $(".zirve").text(response[0] + ":" + String(response[1]));
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
  selectDifficulty();
  $(".zirve").show();
});

$(document).ready(function () {
  $("body ,.hersey").on("click", function (event) {
    if (event.target === this) {
      if (level == 0 && $("input[name='isaret_kutusu']:checked").length > 0) {
        gamePattern = [];
        playerPattern = [];
        nextSequence();
      }
      if (level == -1) {
        $(".ilk").html(baslangic);
        level = 0;
        playerPattern = [];
        $("input[type='radio']").change(function () {
          $.ajax({
            type: "POST",
            url: "/zirvedeki",
            data: {
              zorluk: $("input[name='isaret_kutusu']:checked").data("num"),
            },
            success: function (response) {
              $(".zirve").text(response[0]);
            },
            error: function (xhr, status, error) {
              console.log(error);
            },
          });
          // radio elemanının checked durumu değiştiğinde burada çalışacak kodlar yer alabilir
          selectDifficulty();
        });
        // call the function to assign value to `n`
      }
    }
  });
});

function selectDifficulty() {
  n = parseInt($('input[type="radio"]:checked').val());
  console.log(n);
  if (n == 4) {
    $("#red").css("display","inline-block")
    $("#green").css("display","inline-block")
    $("#blue").css("display", "inline-block");
    $("#yellow").css("display", "inline-block");
  }
  if (n == 3) {
    $("#red").css("display","inline-block")
    $("#green").css("display","inline-block")
    $("#blue").css("display", "none");
    $("#yellow").css("display", "inline-block");
  }
  if (n == 2) {
    $("#red").css("display","inline-block")
    $("#green").css("display","inline-block")
    $("#yellow").css("display", "none");
    $("#blue").css("display", "none");
  }
}







function bitti() {
  audio = new Audio("/sounds/wrong.mp3");
  $(".ilk").html(
    "<h1 id='level-title'>Game Over " +
      String(level) +
      " <br> <br> click anywhere to continue </h1>"
  );
  
    $(".zirve").hide()
  level = -1;
  gamePattern = [];
  playerPattern = [];
  $("input[type='radio']").change(function() {
    // radio elemanının checked durumu değiştiğinde burada çalışacak kodlar yer alabilir
    selectDifficulty();
  });
  $.ajax({
    type: "POST",
    url: "/oyun",
    data: {
      skors:max
    },
    success: function(response) {
       // max dizisini sayısal bir diziye dönüştürün
      console.log(response);
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });

  $(".isimd").show();
  $(".btn").hide()
    
}
function zirveKontrol() {
  if (max[n - 2] < level && level != 1) {
    max[n - 2] = level;
    let myText = $("#my-text");
    // animate() yöntemi ile büyütün ve kaybolmasını sağlayın
    myText.css("visibility", "visible");
    myText.animate(
      {
        fontSize: "100px",
        opacity: 0,
      },
      2500,
      function () {
        $("#my-text").css("visibility", "visible");
        return null;
      }
    );
  }
}
