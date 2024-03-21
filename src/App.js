import "./App.css";
import React, { useState, useEffect } from 'react';

const API_URL = 'https://book-finder1.p.rapidapi.com/api/search';
const API_KEY = 'f6686bf0c7msh845ad2bfe29f814p1f5047jsn74d5f7f54327';

function App() {
  const [books, setBooks] = useState([]);
  const [favourites, setfavourites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [reading, setReading] = useState(false);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [buttonText, setButtonText] = useState('Dark Mode');

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const toggleColors = () => {
    setIsDarkMode(!isDarkMode);
    !isDarkMode ? setButtonText('Dark Mode') : setButtonText('Light Mode');
  };

  useEffect(() => {
    fetchBooks();
  }, [page, author, title]);
  
  const readText = (quote) => {
    let msg = new SpeechSynthesisUtterance();
    msg.text = quote;
    
    if (!reading) { 
      window.speechSynthesis.speak(msg);
      setReading(true);
    } else { 
      window.speechSynthesis.cancel();
      setReading(false);
    }
  };

  const handleNameSearch = (event) => {
    setTitle(event.target.value);
  }

  const handleAuthorSearch = (event) => {
    setAuthor(event.target.value);
  }

  const fetchBooks = async () => {
    let url = `${API_URL}?lexile_min=600&lexile_max=800&results_per_page=24&page=${page}`;
    
    if (author.trim() !== '') {
      url += `&author=${author}`;
    }
    
    if (title.trim() !== '') {
      url += `&title=${title}`;
    }

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'book-finder1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('Fetched data:', data);
      setBooks(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const togglefavourite = (book) => {
    if (favourites.some(fav => fav.work_id === book.work_id)) {
      setfavourites(favourites.filter(fav => fav.work_id !== book.work_id));
    } else {
      setfavourites([...favourites, book]);
    }
  };

  const showfavourites = () => {
    setBooks(favourites);
  };

  return (
    <div className="mainBody" style={{ backgroundColor: isDarkMode ? 'rgba(18, 93, 5, 0.4)' : '#121315' }}>
      <div className='header' style={{ color: !isDarkMode ? 'white' : '#121315' }}>
        <div className="titleName">Shelf</div>
        <button className="button1" style={{ color: !isDarkMode ? 'green' : '#121315' }} onClick={toggleColors}>{buttonText}</button>
        <button className="button1" style={{ color: !isDarkMode ? 'green' : '#121315' }} onClick={showfavourites}>Show favourites</button>
        <div className="menuBarMain">
          <input className="menuBar" type="search" style={{color : !isDarkMode ? 'white' : '#121315' }} onChange={handleNameSearch} value={title} placeholder="Search by Name"/>
          <input className="menuBar" type="search" style={{color : !isDarkMode ? 'white' : '#121315' }} onChange={handleAuthorSearch} value={author} placeholder="Search by Author"/>
        </div>
      </div>

      <div className="bookCard" style={{ color: !isDarkMode ? 'white' : 'black' }}>
      {books && books.length > 0 ? (
  books
    .filter(book => book.published_works[0].isbn)
    .map(book => (
      <div key={book.work_id} className="bookBox">
        <img
          className="coverImg"
          src={`https://s3.amazonaws.com/mm-static-media/books/cover-art/${book.published_works[0].isbn}.jpeg`}
          alt={book.title }
          />
          <h2 className="bookTitle">{book.title}</h2>
        <p>Author: {book.authors[0]}</p>
        <p>Published: {book.published_works[0].copyright}</p>
        {book.categories && book.categories.length >= 2 && (
          <p className="summary">{book.categories[1]}</p>
        )}
        <p>Genre : {book.book_type}</p>
        <button className="readButton" onClick={() => readText(book.summary ? book.summary : "Summary not Found")}>
          Read Summary
        </button>
        <button className="favouriteBtn" onClick={() => togglefavourite(book)}>
          {favourites.some(fav => fav.work_id === book.work_id) ? "Remove from favourites" : "Add to favourites"}
        </button>
      </div>
    ))
) : (
  <p>Loading...</p>
)}

</div>
      <div className="footer">
        <button className="button2" type="button" style={{ color: !isDarkMode ? 'white' : '#121315' }} onClick={handlePreviousPage} disabled={page === 1}>PREVIOUS</button>
        <button className="button2" type="button" style={{ color: !isDarkMode ? 'white' : '#121315' }} onClick={handleNextPage}>NEXT</button>
      </div>
    </div>
  );
}

export default App;