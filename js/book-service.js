"use strict";

const KEY = "Books";
const PAGE_SIZE = 5;
var gPageIndex = 0;
var gBooks;
var gBookDetails;
var gSortBy;
_createBooks();

function _createBooks() {
  var books = loadFromStorage(KEY);
  if (!books || !books.length) {
    var booksToStock = +prompt("How many books to stock?");
    books = [];
    for (let i = 0; i < booksToStock; i++) {
      books.push(_createBook());
    }
  }
  gBooks = books;
  _saveBooksToStorage();
}

function _createBook() {
  return {
    id: makeId(),
    author: makeAuthor(),
    price: getRandomIntInclusive(1, 70),
    title: makeLorem(),
    cover: getRandomIntInclusive(1, 8),
    rating: 0,
    amountOfRatings: 0
  };
}

function nextPage() {
  gPageIndex++;
  if (gPageIndex * PAGE_SIZE >= gBooks.length) {
    gPageIndex = 0;
  }
}

function previousPage() {
  if (gPageIndex === 0) {
    return;
  }
  gPageIndex--;
}

function getSortedBooks() {
  if (gSortBy === "title") {
    var books = gBooks.sort(function (a, b) {
      return a.title > b.title ? 1 : -1;
    });
  } else if (gSortBy === "author-name") {
    var books = gBooks.sort(function (a, b) {
      return a.author > b.author ? 1 : -1;
    });
  } else {
    var books = gBooks.sort(function (a, b) {
      return a.price > b.price ? 1 : -1;
    });
  }
  return books;
}

function setSortBy(value) {
  gSortBy = value;
}

function getBookDetails(bookId) {
  var selectedBook = gBooks.find(function (book) {
    return +book.id === bookId;
  });
  // console.log(selectedBook)
  return {
    id: selectedBook.id,
    author: selectedBook.author,
    title: selectedBook.title,
    photo: selectedBook.cover + `.jpg`,
    description: makeLorem(100),
    rate: selectedBook.rating,
    howManyRated: selectedBook.amountOfRatings,
  };
}

function updateBook(bookId, bookPrice) {
  var bookToUpdate = gBooks.find(function (book) {
    return +book.id === bookId;
  });
  bookToUpdate.price = bookPrice;
  _saveBooksToStorage();
}

function removeBookById(bookId) {
  var idx = gBooks.findIndex(function (book) {
    return +book.id === bookId;
  });
  gBooks.splice(idx, 1);
  _saveBooksToStorage();
  if (gBooks.length === 0) {
    _createBooks
  }
}

function addBook() {
  var newBook = _createBook();
  gBooks.push(newBook);
  _saveBooksToStorage();
}

function _saveBooksToStorage() {
  saveToStorage(KEY, gBooks);
}

function getBooks() {
  var startIndex = gPageIndex * PAGE_SIZE;
  return gBooks.slice(startIndex, startIndex + PAGE_SIZE);
}

function increaseRate() {
  var bookRateValue = document.querySelector(".rate");
  if (bookRateValue.value >= 10) return
  bookRateValue.value++;
}

function decreaseRate() {
  var bookRateValue = document.querySelector(".rate");
  if (bookRateValue.value <= 0) return
  bookRateValue.value--;
}

function addRating(book) {
  var selectedFromGbooks = gBooks.find(function (b) {
    return b.id === book.id;
  });
  console.log(selectedFromGbooks)
  var bookRatingToSubmit = document.querySelector(".rate");
  // book.howManyRated =0
  // book.rate = 0
  selectedFromGbooks.amountOfRatings++;
  selectedFromGbooks.rating = (selectedFromGbooks.rating + +bookRatingToSubmit.value) / selectedFromGbooks.amountOfRatings;
  _saveBooksToStorage();
}

function addBookManually () {
  var titleName = document.querySelector(".title-name")
  var authorName = document.querySelector(".author-name")
  var book = _createBook()
  book.author = authorName.value
  book.title = titleName.value
  gBooks.push(book)
  _saveBooksToStorage()
}

function toggleElmentsDisplay() {
  var elAddBook = document.querySelector(".add-book");
  var elSortBy = document.querySelector(".sort-by");
  var elPageScrollBtns = document.getElementsByClassName("page-select");
  var elAddManually = document.querySelector(".add-manually")
  if (elSortBy.style.display === "none" && elAddBook.style.display === "none") {
    elSortBy.style.display = "inline-block";
    elAddBook.style.display = "inline-block";
    elAddManually.style.display = "flex";
    Array.from(elPageScrollBtns).forEach(function (btn) {
      btn.style.display = "inline-block";
    });
  } else {
    elSortBy.style.display = "none";
    elAddBook.style.display = "none";
    elAddManually.style.display = "none";
    Array.from(elPageScrollBtns).forEach(function (btn) {
      btn.style.display = "none";
    });
  }
}


