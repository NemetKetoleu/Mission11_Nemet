import { useState } from 'react';
import { Books } from '../types/Books'; // Import Books interface
import { updateBooks } from '../api/BooksAPI'; // Assuming you have an updateBook function in your API

interface EditBookFormProps {
  book: Books; // Use the Books interface
  onSuccess: () => void;
  onCancel: () => void;
}

const EditBookForm = ({
  book,
  onSuccess,
  onCancel,
}: EditBookFormProps) => {
  const [formData, setFormData] = useState<Books>({ ...book });
// book is the original object with information(author, title, publisher etc.
// { ...book } creates a copy of that information.
// setFormData({ ...book }) stores this copied information into formData.

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }; // { ...formData }: This copies everything that’s currently in the formData object (like copying the contents of a box). This ensures that nothing gets lost when you update just one part of it.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBooks(formData.bookID, formData); // Assuming updateBooks API function is available
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Book Information</h2>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <label>
        Author:
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
      </label>
      <label>
        Publisher:
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
        />
      </label>
      <label>
        ISBN:
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
        />
      </label>
      <label>
        Classification:
        <input
          type="text"
          name="classification"
          value={formData.classification}
          onChange={handleChange}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </label>
      <label>
        Page Count:
        <input
          type="number"
          name="pageCount"
          value={formData.pageCount}
          onChange={handleChange}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Update Book</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditBookForm;
