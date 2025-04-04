import { useEffect, useState } from 'react';
import { Books } from '../types/Books';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';
import { useCart } from '../context/CartContext';

function BookLists({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Books[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<string>('asc');

  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleToCart = (book: Books) => {
    const cartItem = {
      bookID: book.bookID,
      title: book.title,
      price: book.price,
      quantity: 1,
    };
    addToCart(cartItem);
    navigate('/cart');
  };

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, sortOrder, selectedCategories);
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortOrder, selectedCategories]);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <>
      {books.map((b) => (
        <div id="bookCard" className="card" key={b.bookID}>
          <h3 className="card-title">{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li><strong>Author: </strong>{b.author}</li>
              <li><strong>Publisher: </strong>{b.publisher}</li>
              <li><strong>ISBN: </strong>{b.isbn}</li>
              <li><strong>Classification: </strong>{b.classification}</li>
              <li><strong>Category: </strong>{b.category}</li>
              <li><strong>Number of Pages: </strong>{b.pageCount}</li>
              <li><strong>Price: </strong>${b.price.toFixed(2)}</li>
            </ul>

            <button className="btn btn-success" onClick={() => handleToCart(b)}>
              Add to Cart
            </button>
          </div>
        </div>
      ))}

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        sortOrder={sortOrder}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
        onSortChange={(order) => {
          setSortOrder(order);
          setPageNum(1);
        }}
      />
    </>
  );
}

export default BookLists;
