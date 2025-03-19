import { useEffect, useState } from 'react';
import { Books } from './Books'; 

function BookList() {
    const [books, setBooks] = useState<Books[]>([]); // Changed 'projects' to 'books'
    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState<string>('asc'); // I added sorting state

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(
                `https://localhost:5000/Book/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}`
            );
            const data = await response.json();
            setBooks(data.books); 
            setTotalItems(data.totalNumBooks);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        };
        fetchBooks();
    }, [pageSize, pageNum, totalItems, sortOrder]); 

    return (
        <>
            <h1>Book List</h1>
            <p>This is the list of books available in our collection.</p>
            <br />
            {books.map((b) => (
                <div id="bookcard" className="card" key={b.bookID}>
                    <h3 className="card-title">{b.title}</h3>
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li>
                                <strong>Author: </strong>
                                {b.author}
                            </li>
                            <li>
                                <strong>Publisher: </strong>
                                {b.publisher}
                            </li>
                            <li>
                                <strong>ISBN: </strong>
                                {b.iSBN}
                            </li>
                            <li>
                                <strong>Category: </strong>
                                {b.category}
                            </li>
                            <li>
                                <strong>Number of Pages: </strong>
                                {b.numberOfPages}
                            </li>
                            <li>
                                <strong>Price: </strong>
                                ${b.price.toFixed(2)}
                            </li>
                        </ul>
                    </div>
                </div>
            ))}

            <button 
                disabled={pageNum === 1} 
                onClick={() => setPageNum(pageNum - 1)}
            >
                Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
                <button 
                    key={i + 1} 
                    onClick={() => setPageNum(i + 1)} 
                    disabled={pageNum === (i + 1)}
                >
                    {i + 1}
                </button>
            ))}

            <button 
                disabled={pageNum === totalPages} 
                onClick={() => setPageNum(pageNum + 1)}
            >
                Next
            </button>

            <br />
            <label>
                Results Per Page: 
                <select 
                    value={pageSize} 
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNum(1); // Reset to page 1 when page size changes
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </label>

            <br />
            <label>
                Sort By Title: 
                <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </label>
        </>
    );
}

export default BookList;
