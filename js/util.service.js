"use strict";



function makeId(length = 3) {
  var txt = "";
  var possible =
    "0123456789";

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

function makeLorem(size = 2) {
  var words = [
    "The sky",
    "above",
    "the port",
    "was",
    "the color of television",
    "tuned",
    "to",
    "a dead channel",
    "All",
    "this happened",
    "more or less",
    "I",
    "had",
    "the story",
    "bit by bit",
    "from various people",
    "and",
    "as generally",
    "happens",
    "in such cases",
    "each time",
    "it",
    "was",
    "a different story",
    "It",
    "was",
    "a pleasure",
    "to",
    "burn",
  ];
  var txt = "";
  while (size > 0) {
    size--;
    txt += words[Math.floor(Math.random() * words.length)] + " ";
  }
  return capitaliseFirstLetter(txt);
}

function capitaliseFirstLetter (txt) {
    var upperCaseTxt = txt.charAt(0).toUpperCase()+txt.slice(1)
    return upperCaseTxt
}

function makeAuthor(nameLength = 2) {
  var names = [
    "Liam",
    "Noah",
    "Oliver",
    "William",
    "Elijah",
    "James",
    "Benjamin",
    "Lucas",
    "Mason",
    "Ethan",
    "Alexander",
    "Henry",
    "Jacob",
    "Olivia",
    "Emma",
    "Ava",
    "Sophia",
    "Isabella",
    "Charlotte",
    "Amelia",
    "Mia",
    "Harper",
    "Evelyn",
    "Abigail",
    "Emily",
    "Ella",
  ];
  var authorName = "";
  while (nameLength > 0) {
    nameLength--;
    authorName += names[Math.floor(Math.random() * names.length)] + " ";
  }
  return authorName;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

