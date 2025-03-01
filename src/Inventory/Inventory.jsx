import Categories from "./Categories";
import Products from "./Products";

const Inventory = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <Categories />
      <Products />
      
    </div>
  );
};

export default Inventory;
