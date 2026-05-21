export default function CategoryFilter({ activeCategory, categories, onChange }) {
  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-chip ${
            activeCategory === category ? 'category-chip-active' : ''
          }`}
          type="button"
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
