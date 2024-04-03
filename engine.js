/*
  levelsSets:   Dictionary(String, Array[String(3)])
  allScripting: Array[String(3)]
  allSpeech:    Array[String(3)]
  speech2name:  Dictionary(String(3), String)
  script2name:  Dictionary(String(3), String)
  audiofiles:   Dictionary(String(3), Array[String](5))
*/

var availScripts = new Set(allScripting),
  availSpeeches = new Set(allSpeech);
var availCodes = availSpeeches;
var gameMode = "choose";
var type = "speech";
var score = 0;
var level = 0;
var strike = 0;
var fastPlay = false; // Correct/Wrong without pressing next
var levels = new Array();

const shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const additionalOptions = (n) => Math.floor(Math.min(n, 2450) / 250) + 2;

function randAdd(set, k, result) {
  let arr = Array.from(set);

  for (let i = 0; i < Math.min(k, arr.length); i++) {
    let randIndex = Math.floor(Math.random() * arr.length);
    result.push(arr[randIndex]);
    arr.splice(randIndex, 1);
  }
  return shuffle(result);
}

const resetScore = function () {
  score = 0;
  strike = 0;
  level = 0;
};

const theGreatReset = function () {
  availScripts = new Set(allScripting);
  availSpeeches = new Set(allSpeech);
  Object.keys(audiofiles).forEach((key) => shuffle(audiofiles[key]));
  gameMode = "choose";
  type = "speech";
  availCodes = availSpeeches;
  fastPlay = 0;
  score = 0;
  level = 0;
  strike = 0;
  levels = new Array();
  generateLevels();
};

const delScriptCode = function (name) {
  availScripts.delete(name);
};

const addScriptCode = function (name) {
  availScripts.add(name);
};

const delSpeechCode = function (name) {
  availSpeeches.delete(name);
};

const addSpeechCode = function (name) {
  availSpeeches.add(name);
};

const redefineCodes = function (difficulty, isSpeech) {
  if (isSpeech) {
    availSpeeches = new Set(levelsSets[difficulty]);
    availCodes = availSpeeches;
  } else {
    availScripts = new Set(levelsSets[difficulty]);
    availCodes = availScripts;
  }
};

const generateLevels = () => {
  codes = Array.from(availCodes);
  // Preset the levels
  levels = codes.flatMap((code) =>
    Array.from({ length: 5 }, (_, i) => ({
      ans: code,
      choices: [code],
      file: audiofiles[code][i],
    })),
  );
  levels = shuffle(levels);
};

const choose = function (code) {
  ans = levels[level - 1]["ans"];
  status = code === ans;
  if (status == "true")
    score += 50; // for some reason status is stringx
  else strike++;
  return [status, strike, score, ans];
};

const getNext = function () {
  curLevel = levels[level];
  m = additionalOptions(score);
  code = curLevel.ans;
  availCodes.delete(code);
  randAdd(availCodes, m, curLevel["choices"]);
  availCodes.add(code);
  level++;
  return curLevel;
};

$(document).ready(function () {
  generateLevels();
});
