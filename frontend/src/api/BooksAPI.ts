// We import the 'Books' type to use it in this file, so TypeScript knows how a book should be structured.
// This helps ensure that we work with book data correctly and follow the rules defined for it.
// This file is responsible for communicating with the API (the website that stores the book data).
// It contains functions to fetch, add, update, and delete books from the API.
import { Books } from '../types/Books';

// This interface defines the structure of the data we get when we fetch books
// It includes an array of books and the total number of books available.
// The array of books is of type Books[], which means it's an array of objects that follow the Books structure defined in the Books.ts file.
// The totalNumBooks is a number that tells us how many books are available in total.
interface FetchBooksResponse {
  books: Books[];
  totalNumBooks: number;
}
// This is the URL of the API (the website that stores the books data).
// The API_URL is the address where we can find the books data. We will use this URL to send requests to the API to get or change book information.
const API_URL = 'https://your-api-url.com/Books';



// This function fetches books from the API (the website that stores the books).
// It takes the number of books to show on one page (pageSize), the page number (pageNum), and the selected categories (selectedCategories).
// It returns a promise that resolves to the books and the total number of books available.
export const fetchBooks = async (
  pageSize: number, // pageSize is how many books we want to fetch per page.
  pageNum: number, // pageNum is the current page number we are on.
  sortOrder: string, // sortOrder is how we want to sort the books (like ascending or descending order).
  // selectedCategories is an array of categories we want to filter the books by.
  selectedCategories: string[] = [] // Default to an empty array if no categories are passed
): Promise<FetchBooksResponse> => {
  try {
    // Build the query parameter for book categories if there are any selected categories
// For example, if you selected categories "cat1" and "cat2", it will create a string like this: category=cat1&category=cat2
const categoryParams = selectedCategories // This is the array of selected categories.
      .map((cat) => `category=${encodeURIComponent(cat)}`) // For each category, we add it to the URL (with proper encoding to handle special characters).
      .join('&'); // Join them with '&' to separate the categories in the URL.
    
      // We then make a request to the API to fetch the books. We include the page size, page number, and the selected categories (if any).
    // The API will return the books that match the criteria we provided. The API will also tell us how many books are available in total.
    const response = await fetch(
      `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`
    );
    // If the response is not okay (something went wrong), we throw an error.
    // The response.ok property is true if the request was successful (the books were fetched). If it's false, it means something went wrong.
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    // If everything is okay, we return the books as the response.
    return await response.json(); // We expect the response to be in JSON format, and we return it as a FetchBooksResponse.
  } catch (error) {
    console.error('Error fetching books:', error); // If something goes wrong, we log the error to the console so we can see it.
    throw error; // We re-throw the error so that the calling code knows something went wrong
  }
};




// This function is for adding a new book to the API (the website that stores the books).
export const addBook = async (newBook: Books): Promise<Books> => {
  try {
    // We send the new book information to the API (website) to save it.
    // We use the POST method, which means we are adding something new.
    // The newBook is like a package with all the information about the book we want to add.
    // The API will create a new book with this information.
    // The API will give us back the new book with its ID and other details.
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // We tell the website that the information we are sending is in JSON format.
      },
      body: JSON.stringify(newBook), // We convert the new book information into a string so we can send it.
    });
    // If the website responds with an error (it fails to add the book), we throw an error.
    // The response.ok property is true if the request was successful (the book was added). If it's false, it means something went wrong.
    // We throw an error to let the rest of the code know that there was a problem.
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
    // If everything works well, we return the added book (the response from the website).
    // The API sends back the new book information, including its ID and other details.
    // We use await to wait for the response to be converted from JSON format to a JavaScript object.
    return await response.json(); // TypeScript knows this should be a Book
  } catch (error) {
    console.error('Error adding book', error); // If something goes wrong, we print an error message to the console.
    throw error; // Re-throw to ensure calling code handles it
  }
};




// This function is for updating a book in the API (the website that holds the books data).
export const updateBook = async (
    bookID: number, // The ID of the book we want to update (like a name tag for the book).
    updatedBook: Books // The updated information about the book, like its new title, author, etc.
  ): Promise<Books> => { // We promise to give back a book after updating it.
    try {
      // We send the updated book information to the API (website) to save it.
      const response = await fetch(`${API_URL}/UpdateBook/${bookID}`, {
        method: 'PUT', // We are using the 'PUT' method, which means we are updating something.
        headers: {
          'Content-Type': 'application/json', // We tell the website that we are sending a book in the format of JSON (a way to send information).
        },
        body: JSON.stringify(updatedBook), // We turn the updated book into a string that can be sent to the website.
      });
      // If the response is not okay (something went wrong), we throw an error.
      if (!response.ok) {
        throw new Error('Failed to update book'); // This message will help us know what went wrong.
      }
      // If everything goes well, we take the response from the API (the updated book) and give it back.
      return await response.json(); // The API sends back the updated book information.
    } catch (error) {
      console.error('Error updating book:', error); // If something goes wrong, we print an error message to the console.
      throw error; // We throw the error so the rest of the code knows that there was a problem.
    }
  };




// Delete a book from the API
// This function is for deleting a book from the API (the website that stores the book data).
export const deleteBook = async (bookID: number): Promise<void> => {
  try {
        // We send a request to the website (API) asking it to delete the book.
    // We use the DELETE method, which means we want to remove something.
    // The bookID is like a name tag for the book we want to delete.
    const response = await fetch(`${API_URL}/DeleteBook/${bookID}`, {
      method: 'DELETE',
    });
    // If the website responds with an error (the deletion failed), we throw an error.
    // The response.ok property is true if the request was successful (the book was deleted).If it's false, it means something went wrong.
    // We throw an error to let the rest of the code know that there was a problem.
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error); // If something goes wrong, we print an error message to the console.
    throw error; // We throw the error so the rest of the code knows that there was a problem.

  }
};
