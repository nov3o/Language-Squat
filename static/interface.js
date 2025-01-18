/*
  levelsSets:    Dictionary(String, Array[String(3)])
  allSpeech:     Array[String(3)]
  speech2name:   Dictionary(String(3), String)
  audiofiles:    Dictionary(String(3), Array[String](5))

  availCodes:    Set[String(3)]
  gameMode:      String
  score:         Integer
  level:         Integer
  strike:        Integer
  fastPlay:      Boolean
  levels:        Array[Dictionary]
*/

var allLangSelButtons;
sectionEl = $("#game > section");
gameScreenEl = $("#choices-menu");
restMainMenuEls = $(sectionEl).find("> div > p, > div > div");
langGameButtonsEls = $("#lang-game-buttons");
strikeEl = $("#strike");
scoreEl = $("#score");
corrEl = $("#corr");
gameOverEl = $("#game-over-div");
winEl = $("#win-div");
finishEl = $("#finish-div");
nextEl = $("#next-div");
levelEl = $("#level");
nLangsEl = $("#nlangs");
langSelMenu = $("#lang-selection")
audio = $("#audio")[0]
audioButton = $("#audio-button")
autoPlayBtn = $("#auto-play")

gameFinished = 0;
hasChosen = 0;
levelName = "beginner"
autoPlay = 0
infGame = 0
autoNext = 0

playText = `&nbsp; Play&nbsp; <i class="fa fa-play"></i>&nbsp;`
stopText = `&nbsp; Stop&nbsp; <i class="fa fa-stop"></i>&nbsp;`

function toggleSelect(element, key) {
  levelName = "Custom"

  if (availCodes.has(key)) {
    availCodes.delete(key);
    $(element).removeClass("correct");
  } else {
    availCodes.add(key);
    $(element).addClass("correct");
  }

  $(nLangsEl).text(availCodes.size + " Languages");
}

i2k = [1,2,3,4,5,6,7,8,9,0,'-','=']  // index to key
function createChoiceButton(code, lang, i=42) {
  return `
        <div class="col-12 col-sm-6 col-lg-4">
          <button class="sstestoption"  id="${code}" onclick="chooseOption(this, '${code}')">
            <div style="padding: 10px">
              <span class="fa fa-circle-o"></span> <span>[${i2k[i]}] ${lang}</span>
            </div>
          </button>
        </div>`;
}

function addButtons() {
  $(langGameButtonsEls).empty();
  var elementsHTML = "";
  for (let i = 0; i < curLevel.choices.length; i++) {
    code = curLevel.choices[i];
    elementsHTML += createChoiceButton(code, speech2name[code], i);
  }
  $(langGameButtonsEls).append(elementsHTML);

  // LangSquad files
  audio.src = `https://www.languagesquad.com/audio/${curLevel.ans}/${curLevel.file}`
  // Local files
  // audio.src = `audio/${curLevel.file}` 
  $(audioButton).html(playText).removeClass("btn-danger").addClass("btn-primary")  // Reset
}

function audioControl() {
  $(audioButton).toggleClass("btn-danger btn-primary")
  if (audio.paused) {
    audio.play()
    $(audioButton).html(stopText)
  } else {
    audio.pause();
    audio.currentTime=0
    $(audioButton).html(playText)
  }
}

function autoPlayClick() {
  $(autoPlayBtn).toggleClass("fa-forward fa-step-forward text-success")
  autoPlay ^= 1;
}

function playLevel() {
  curLevel = getNext();

  addButtons();
  hasChosen = 0;
  gameFinished = 0;
  $(levelEl).text(`${level}/${levels.length}`);
  $(nextEl).css("display", "none");

  if (autoPlay) audioControl()  // Imitate the press 
}

function playGame() {
  if (!availCodes.size) return;
  generateLevels();
  $(finishEl).css("display", "none");
  $(nextEl).css("display", "none");
  playLevel();
  $(sectionEl).toggleClass("shrink pb-3");
  $(restMainMenuEls).css("display", "none");
  $(gameScreenEl).css("display", "block");
}

function select(element) {
  $(".row.justify-content-center .sstestoption.selected")
    .removeClass("selected");
  $(".sstestoption .fa-check-circle-o")
    .removeClass("fa-check-circle-o")
    .addClass("fa-circle-o");

  // Find the span within the clicked element and change its class
  $(element)
    .find("span")
    .removeClass("fa-circle-o")
    .addClass("fa-check-circle-o");

  $(element).addClass("selected");

  levelName = $(element).prop("id")
  redefineCodes(levelName);
  updateSelLangs();
  $(nLangsEl).text(availCodes.size + " Languages");
}

function updateSelLangs() {
  $(allLangSelButtons).removeClass('correct'); 

  $.each(Array.from(availCodes), function(index, code) {
    $(`#${code}`).addClass('correct');
  });
}

function playAgain() {
  theGreatReset();

  $(strikeEl).text(0);
  $(scoreEl).text(0);
  $(finishEl).css("display", "none");
  //
  playLevel();
  $(nextEl).css("display", "none");
}

function end() {
  // To main menu
  if ($(sectionEl).hasClass("pb-3")) return;
  $(sectionEl).toggleClass("shrink pb-3");
  $(restMainMenuEls).css("display", "block");
  $(gameScreenEl).css("display", "none");
  $(finishEl).css("display", "none");
  $(strikeEl).text(0);
  $(levelEl).text(1);
  $(scoreEl).text(0);
  audio.src = ""
  theGreatReset();
}

function showPopup(ans, isCorrect) {
  const popup = document.createElement('div');
  popup.classList.add('popup', isCorrect ? 'green' : 'red');
  popup.innerText = `Correct Answer: ${ans}`;
  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.opacity = 0;
    setTimeout(() => popup.remove(), 500);
  }, 2000);
}

function chooseOption(element, code) {
  if (hasChosen || gameFinished) return;
  [status, strike, score, ans] = choose(code);
  console.log(ans, code)
  $(element)
    .find("div > span:first-child")
    .toggleClass("fa-check-circle-o fa-circle-o");
  $(gameScreenEl).find("#" + ans).addClass("correct");
  if (status == "false") $(element).addClass("wrong");
  if (strike >= 3 && !infGame) displayEnd();
  // if (strike >= 3) displayEnd();
  else if (level == levels.length) displayWin();
  else displayNext();
  // if (!infGame) $(strikeEl).text(strike);
  $(strikeEl).text(strike);
  $(corrEl).text(level - strike);
  $(scoreEl).text(score);
  hasChosen = 1;
  if (autoNext) {
    playLevel()
    showPopup(speech2name[ans], ans == code)
  }
}

function displayNext() {
  $(nextEl).css("display", "block");
}

function displayWin() {
  HTML = `Congrats!<br />You finished the ${levelName} Level.<br />Final Score: ${score}`
  $("#win-h2").html(HTML)
  $(nextEl).css("display", "none");
  $(finishEl).css("display", "block");
  $(winEl).css("display", "block");
  $(gameOverEl).css("display", "none");
}

function displayEnd() {
  HTML = `Game Over.<br>Final Score: ${score}`
  $("#over-h2").html(HTML)
  $(nextEl).css("display", "none");
  $(finishEl).css("display", "block");
  $(winEl).css("display", "none");
  $(gameOverEl).css("display", "block");
}

function toggleInfinite(element) {
  infGame ^= 1
  $(element).toggleClass("btn-primary btn-outline-primary")
}

function toggleAutoNext(element) {
  autoNext ^= 1
  $(element).toggleClass("btn-primary btn-outline-primary")
}  

/* Event Bindings */
$(document).keydown(function(event) {
  kC = event.keyCode;
  switch (kC) {
  case 97:
  case 65:
    autoPlayClick()
    return
  case 13:  // return
    if (nextEl.css('display') != 'none') playLevel()
    return
  case 83: // S
    ix = curLevel.choices.findIndex(choice => choice === curLevel.ans);
    $(langGameButtonsEls).find("> div > button")[ix].click();  
    return
  case 32: // Spacebar
    if (gameScreenEl.css('display') != 'none') audioControl()
    return
  default: // test for 1234567890-=
    t = {0: 9, 141: 10, 139: 11}
    kC -= 48;
    ix = -1;
    if (kC >= 1 && kC <= 9) ix = kC-1; // 123456789
    else if (kC in t) ix = t[kC];  // 0-=

    if (ix != -1) $(langGameButtonsEls).find("> div > button")[ix].click();  
  }
});

$(document).ready(function() {
  var innerHTML = ''; 
  $(langSelMenu).empty();

  $.each(speech2name, function(k, v) {
    innerHTML += `<div class="lang-option">
                    <button class="sstestoption" onclick="toggleSelect(this, '${k}')" id="${k}">
                      <div style="padding: 10px">
                        <span>${v}</span>
                      </div>
                    </button>
                  </div>`;
  });
  $(langSelMenu).append(innerHTML);
  allLangSelButtons = $(langSelMenu).find("div > button")
  redefineCodes('Beginner');
  updateSelLangs();

  const $setsList = $('#sets-list'); // Assuming #sets-list is your target container

  $.each(levelsSets, function (key, value) {
    const buttonHtml = `
        <div class="col-12 col-lg-4 col-md-4 col-sm-6">
            <button
              onclick="select(this)"
              title="${key}, ${value.length} Languages"
              class="sstestoption"
              id="${key}"
              >
              <div style="padding: 5px 10px">
                <span class="fa fa-circle-o"></span>
                ${key}
              </div>
            </button>
        </div>`;
    $setsList.append(buttonHtml);
  });
});
