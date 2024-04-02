/*
  levelsSets:   Dictionary(String, Array[String(3)])
  allScripting: Array[String(3)]
  allSpeech:    Array[String(3)]
  speech2name:  Dictionary(String(3), String)
  script2name:  Dictionary(String(3), String)
  audiofiles:   Dictionary(String(3), Array[String](5))

  availScript:  Set[String(3)]
  availCodes:   Set[String(3)]
  gameMode:     String
  type:         String
  score:        Integer
  level:        Integer
  strike:       Integer
  fastPlay:     Boolean
  levels:       Array[Dictionary]
*/

function toggleSelect(element, key) {
  // Using jQuery to toggle class 'active' on the clicked button
  $(element).toggleClass("active");

  // Toggling the key in the dictionary object
  if (dictionary[key]) {
    delete dictionary[key];
  } else {
    dictionary.insert(key);
  }
}

function playGame() {
  curLevel = getNext();
  // redraw several buttons
  $("#game > section").toggleClass("shrink pb-3");
  $("#game > section > div > *:gt(0)").css("display", "none");
  $("#choices").css("display", "block");
}

function select(element) {
  $(".row.justify-content-center .sstestoption.selected").removeClass(
    "selected",
  );
  $(".sstestoption .fa-check-circle-o")
    .removeClass("fa-check-circle-o")
    .addClass("fa-circle-o");

  // Find the span within the clicked element and change its class
  $(element)
    .find("span")
    .removeClass("fa-circle-o")
    .addClass("fa-check-circle-o");

  $(element).addClass("selected");
}

function playAgain() {
  theGreatReset();
  curLevel = getNext();

  // redraw several buttons
}

function end() {
  $("#game > section").toggleClass("shrink pb-3");
  $("#game > section > div > *:gt(0)").css("display", "block");
  $("#choices").css("display", "none");
}

$(document).keydown(function (event) {
  if (event.key === "Escape" || event.keyCode === 27) {
    end();
  }
});
