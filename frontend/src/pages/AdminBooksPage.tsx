import { useEffect, useState } from 'react';
import { Books } from '../types/Books'; // Import Books interface
import { deleteBook, fetchBooks } from '../api/BooksAPI'; // Import API functions
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

  // Set up state to store books, errors, and loading status
const AdminBooksPage = () => {
  const [books, setBooks] = useState<Books[]>([]); // Store the list of books
  const [error, setError] = useState<string | null>(null); // Store error message if something goes wrong
  const [loading, setLoading] = useState(true); // Keep track if data is still loading
  const [pageSize, setPageSize] = useState<number>(10); // Store the number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Store the current page number
  const [totalPages, setTotalPages] = useState<number>(0); // Store the total number of pages
  const [showForm, setShowForm] = useState(false); // Control visibility of the add book form
  const [editingBook, setEditingBook] = useState<Books | null>(null); // Store the book being edited




    // This effect runs when pageSize or pageNum changes
  useEffect(() => {
        // This function loads books from the API
    const loadBooks = async () => {
      try {
        const data = await fetchBooks(pageSize, pageNum); // Fetch books from API. ce qui signifie que tu dois contruire ton BooksAPI.ts en premier
        setBooks(data.books); // Save the list of books (data.books) into the component's memory, so that React can display them on the page and update if anything changes.
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // Calculate the total number of pages based on the total number of books and the page size
      } catch (err) {
        setError((err as Error).message); // Set the error message if something goes wrong
// the finally block means no matter whether the code inside the try block succeeds or fails (whether or not there is an error), 
// the code inside the finally block will always run if set to true.
      } finally {
        setLoading(false); // The finally block ensures that the loading spinner is stopped, regardless of whether the fetch operation succeeds or fails.
      }
    };
    loadBooks(); // Call the loadBooks function to fetch the books when the component mounts or when pageSize or pageNum changes
  }, [pageSize, pageNum]);




  // Handle the delete action when a book is deleted
  // This function is called when the delete button is clicked
  // It takes the book ID as an argument and deletes the book from the API and updates the state
  const handleDelete = async (bookId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?'
    );
    if (!confirmDelete) return; // If the user clicks "Cancel", we stop the delete action
    // If the user clicks "OK", we proceed with the delete action
    try {
      await deleteBook(bookId); // Call API to delete the book. Delete the book from the API using the deleteBook function
      // After deleting the book, we update the state to remove it from the list of books
      setBooks(books.filter((b) => b.bookID !== bookId)); // Remove the deleted book from the list
    } catch (error) {
      alert('Failed to delete book. Please try again.');
    }
  };
  // Show loading message while waiting for data
  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>; // Show error message if there is an error

  return (
    <div>
      <h1>Admin - Books</h1>

      {/* Button to show add book form */}
      {/* This button is used to add a new book. When clicked, it sets the 'showForm' state to true, which will show the form for adding a new book. */}
      {/* The button is styled with Bootstrap classes for a success button and has a margin at the bottom. */}
      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Book
        </button>
      )}

    {/* Show the 'New Book Form' */}
    {/* If 'showForm' state is true, this renders the 'NewBookForm' component to allow the user to add a new book */}
    {/* The 'onSuccess' prop is a function that will be called when the book is successfully added. It hides the form and fetches the updated list of books. */}
    {/* The 'onCancel' prop is a function that will be called when the user cancels the form, hiding it. */}
      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false); // After successfully adding the book, hide the form by setting 'showForm' back to false.
            fetchBooks(pageSize, pageNum).then((data) => // Fetch the latest books to update the list.
              setBooks(data.books) // Set the updated list of books into the state.
            ); 
          }}
          onCancel={() => setShowForm(false)} // Cancel button hides the form by setting 'showForm' to false.
          // The 'onCancel' prop is a function that will be called when the user cancels the form, hiding it.
          // The 'onSuccess' prop is a function that will be called when the book is successfully added. It hides the form and fetches the updated list of books.
        />
      )}

    {/* Show the 'Edit Book Form' */}
    {/* If 'editingBook' state is not null, this renders the 'EditBookForm' component to allow the user to edit a book */}
    {/* The 'book' prop is the book that is being edited. */}
      {editingBook && (
        <EditBookForm
          book={editingBook}  // Pass the book being edited as a prop to the form.
          onSuccess={() => {
            setEditingBook(null); // After successfully editing, set 'editingBook' to null to hide the form.
            fetchBooks(pageSize, pageNum).then((data) => // Fetch updated books list to show the changes.
              setBooks(data.books) // Update the books state with the newly fetched books.
            );
          }}
          onCancel={() => setEditingBook(null)} // If cancel is clicked, set 'editingBook' to null to hide the edit form.
        />
      )}


      {/* Table to display the list of books */}
      {/* This table shows the list of books with their details. Each book has buttons to edit or delete it. */}
      {/* The table is styled with Bootstrap classes for a bordered and striped look. */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Page Count</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookID}>
              <td>{b.bookID}</td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>{b.price}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => setEditingBook(b)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => handleDelete(b.bookID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    {/* Pagination component to manage page numbers and page sizes */}
      <Pagination
      currentPage={pageNum}  // Pass the current page number to the Pagination component.
      totalPages={totalPages}  // Pass the total number of pages to the Pagination component.
      pageSize={pageSize}  // Pass the current page size to the Pagination component.
      onPageChange={setPageNum}  // When a page number is clicked, this updates the 'pageNum' state.
      onPageSizeChange={(newSize) => {
        setPageSize(newSize);  // When page size is changed, update the 'pageSize' state.
        setPageNum(1);  // Set the page number back to 1 when page size changes.
        }}
      />
    </div>
  );
};

export default AdminBooksPage;