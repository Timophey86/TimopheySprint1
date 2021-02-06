var gTrans = {
  title: {
    en: "Title",
    he: "כותרת",
  },
  price: {
    en: "Price",
    he: "מכיר",
  },
  "sort-by": {
    en: "Sort By",
    he: "לסנן לפי",
  },
  "author-name": {
    en: "Author Name",
    he: "שם הסופר",
  },
  action: {
    en: "Action",
    he: "פעולות",
  },
  next: {
    en: "Next",
    he: "הבא",
  },
  previous: {
    en: "Previous",
    he: "הקודם",
  },
  add: {
    en: "Add",
    he: "הוסף",
  },
  delete: {
    en: "Delete",
    he: "מחק",
  },
  update: {
    en: "Update",
    he: "עדכן",
  },
  read: {
    en: "Read",
    he: "לקרוא",
  },
  sort: {
    en: "Sort By",
    he: "מיין לפי",
  },
  id: {
    en: "ID",
    he: "קוד ספר",
  },
  'select-language': {
    en: "Select Language",
    he: "בחר שפה", 
  },
  'title-name': {
    en: "Title name:",
    he: "שם הספר:", 
  },
  'author-name': {
    en: "Author:",
    he: "שם המחבר:", 
  },
  'enter-manually': {
    en: "Enter Book Manually:",
    he: "הוסף ספר:", 
  },
  'add-manually': {
    en: "Add",
    he: "הוסף", 
  }
};

var gCurrLang;

function doTrans() {
  var els = document.querySelectorAll("[data-trans]");
  els.forEach(function (el) {
    var transKey = el.dataset.trans;
    var txt = getTrans(transKey);

    el.innerText = txt;
  });
}

function getTrans(transKey) {
  var keyTrans = gTrans[transKey];
  if (!keyTrans) return "UNKNOWN";
  var txt = keyTrans[gCurrLang];

  if (!txt) txt = keyTrans["en"];
  return txt;
}

function setLang(lang) {
  gCurrLang = lang;
}
