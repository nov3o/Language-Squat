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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const additionalOptions = (n) => Math.floor(Math.min(n, 2450) / 250) + 2;

function randAdd(set, k, result) {
  let arr = Array.from(set);

  for (let i = 0; i < Math.min(k, arr.length); i++) {
    let randIndex = Math.floor(Math.random() * arr.length);
    result.push(arr[randIndex]);
    arr.splice(randIndex, 1);
  }
  return result;
}

const resetScore = function () {
  score = 0;
  strike = 0;
  level = 1;
};

const theGreatReset = function () {
  (availScripts = new Set(allScripting)), (availSpeeches = new Set(allSpeech));
  Object.keys(audiofiles).forEach((key) => shuffleArray(audiofiles[key]));
  gameMode = "choose";
  type = "speech";
  availCodes = Array.from(availSpeeches);
  fastPlay = 0;
  score = 0;
  level = 1;
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
  if (isSpeech) availSpeeches = levelsSets[difficulty];
  else availScripts = levelsSets[difficulty];
};

const generateLevels = () => {
  codes = Array.from(type === "speech" ? availSpeeches : availScripts);
  // Preset the levels
  levels = codes.flatMap((code) =>
    Array.from({ length: 5 }, (_, i) => ({
      ans: code,
      choices: [code],
      file: audiofiles[code][i],
    })),
  );
  shuffleArray(levels);
};

const choose = function (code) {
  ans = levels[level - 1]["ans"];
  status = code === ans;
  if (status == "true")
    score += 250; // for some reason status is stringx
  else strike++;
  return [status, strike, score, ans];
};

const getNext = function () {
  curLevel = levels[level];
  m = additionalOptions(score);
  code = curLevel.ans;
  availCodes.delete(code);
  randAdd(availCodes, m, curLevel["choices"]);
  level++;
  return curLevel;
};

$(document).ready(function () {
  generateLevels();
});
