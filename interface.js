/*
  levelsSets:    Dictionary(String, Array[String(3)])
  allScripting:  Array[String(3)]
  allSpeech:     Array[String(3)]
  speech2name:   Dictionary(String(3), String)
  script2name:   Dictionary(String(3), String)
  audiofiles:    Dictionary(String(3), Array[String](5))

  availScripts:  Set[String(3)]
  availSpeeches: Set[String(3)]
  availCodes:    Set[String(3)]
  gameMode:      String
  type:          String
  score:         Integer
  level:         Integer
  strike:        Integer
  fastPlay:      Boolean
  levels:        Array[Dictionary]
*/

sectionEl = $("#game > section");
gameScreenEl = $("#choices-menu");
restMainMenuEls = $(sectionEl).find("> div > p, > div > div");
langGameButtonsEls = $("#lang-game-buttons");
strikeEl = $("#strike");
scoreEl = $("#score");
gameOverEl = $("#game-over-div");
winEl = $("#win-div");
finishEl = $("#finish-div");
nextEl = $("#next-div");
levelEl = $("#level");
nLangsEl = $("#nlangs");

gameFinished = 0;
hasChosen = 0;

function toggleSelect(element, key) {
  $(element).toggleClass("active");

  // Toggling the key in the dictionary object
  if (dictionary[key]) {
    delete dictionary[key];
  } else {
    dictionary.insert(key);
  }
}

function createButton(code, lang) {
  return `
        <div class="col-12 col-sm-6 col-lg-4">
          <button class="sstestoption"  id="${code}" onclick="chooseOption(this, '${code}')">
            <div style="padding: 10px">
              <span class="fa fa-circle-o"></span> <span>${lang}</span>
            </div>
          </button>
        </div>`;
}

function addButtons() {
  $(langGameButtonsEls).empty();
  var elementsHTML = "";
  for (let i = 0; i < curLevel.choices.length; i++) {
    code = curLevel.choices[i];
    elementsHTML += createButton(code, speech2name[code]);
  }
  $(langGameButtonsEls).append(elementsHTML);
}

function playLevel() {
  curLevel = getNext();

  addButtons();
  hasChosen = 0;
  gameFinished = 0;
  $(levelEl).text(level);
  $(nextEl).css("display", "none");
}

function playGame() {
  generateLevels();
  $(finishEl).css("display", "none");
  $(nextEl).css("display", "none");
  playLevel();
  $(sectionEl).toggleClass("shrink pb-3");
  $(restMainMenuEls).css("display", "none");
  $(gameScreenEl).css("display", "block");
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

  redefineCodes($(element).prop("id"), 1);
  updateSelLangs();
  $(nLangsEl).text(availCodes.size + " Languages");
}

function updateSelLangs() {}

function playAgain() {
  theGreatReset();

  $(strikeEl).text(0);
  $(scoreEl).text(0);
  $(finishEl).css("display", "none");
  playLevel();
  $(nextEl).css("display", "none");
}

function end() {
  // To main menu
  if ($(sectionEl).hasClass("pb-3")) return;
  $(sectionEl).toggleClass("shrink pb-3");
  $(restMainMenuEls).css("display", "block");
  $(gameScreenEl).css("display", "none");
  $(strikeEl).text(0);
  $(levelEl).text(1);
  $(scoreEl).text(0);
  theGreatReset();
}

function chooseOption(element, code) {
  if (hasChosen || gameFinished) return;
  [status, strike, score, ans] = choose(code);
  $(element)
    .find("div > span:first-child")
    .toggleClass("fa-check-circle-o fa-circle-o");
  $("#" + ans).addClass("correct");
  if (status == "false") $(element).addClass("wrong");
  if (strike >= 3) displayEnd();
  else if (level == levels.length) displayWin();
  else displayNext();
  $(strikeEl).text(strike);
  $(scoreEl).text(score);
  hasChosen = 1;
}

function displayNext() {
  $(nextEl).css("display", "block");
}

function displayWin() {
  $(nextEl).css("display", "none");
  $(finishEl).css("display", "block");
  $(winEl).css("display", "block");
  $(gameOverEl).css("display", "none");
}

function displayEnd() {
  $(nextEl).css("display", "none");
  $(finishEl).css("display", "block");
  $(winEl).css("display", "none");
  $(gameOverEl).css("display", "block");
}

/* Key Bindings */

$(document).keydown(function (event) {
  if (event.key === "Escape" || event.keyCode === 27) {
    end();
  }
});
