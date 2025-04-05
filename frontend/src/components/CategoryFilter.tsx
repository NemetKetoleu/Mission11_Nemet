import { useEffect, useState } from 'react';
import './CategoryFilter.css';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);




  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://bookproject-nemet-backend.azurewebsites.net/Book/GetBookTypes'
        );// Backend refers to the part of the website that works behind the scenes. It handles things like data storage, fetching 
        // information, and more. It usually runs on a server. Frontend refers to what the user sees and interacts with directly in their browser (like the webpage with buttons and text). It runs on the user's computer or device.
        const data = await response.json();
        console.log('Fetched categories:', data);
        // I would like to get rid of const categoriesList below
        // Check if data is an array and map to get category names
        // The map function is used to create a new array by applying a function to each element of the original array. In this case, it's used to extract the category names from the fetched data.
        const categoriesList = Array.isArray(data)
        ? data.map((cat) =>
            typeof cat === 'string' ? cat : cat.categoryName
          )
        : [];

        setCategories(categoriesList);
      } catch (error) {
        console.error('Sorry, we encountered a little error fetching categories. Sorry about that.', error);
      }
    };
    fetchCategories();
  }, []);


  
  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];
    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="category-filter">
      <h5>Book Types</h5>
      <div className="category-list">
        {categories.map((b) => (
          <div key={b} className="category-item">
            <input
              type="checkbox"
              id={b}
              value={b}
              className="category-checkbox"
              onChange={handleCheckboxChange}
            />
            <label htmlFor={b}>{b}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;