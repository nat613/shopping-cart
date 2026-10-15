import { useState } from "react";
import { useGetCategoriesQuery } from "../store/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItem, removeItem } from "../store/cartSlice";
import type { CartItem } from "../store/types";

interface Props {
  onContinue: () => void;
}

export default function ShoppingList({ onContinue }: Props) {
  const { data: categories, isLoading, isError, refetch } = useGetCategoriesQuery();
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();

  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const category = categories?.find((c) => c.id === Number(categoryId));
  const product = category?.products.find((p) => p.id === Number(productId));
  const canAdd = !!category && !!product && Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;

  const handleAdd = () => {
    if (!category || !product || !canAdd) return;
    dispatch(
      addItem({
        productId: product.id,
        productName: product.name,
        categoryId: category.id,
        categoryName: category.name,
        quantity,
      }),
    );
    setProductId("");
    setQuantity(1);
  };

  const groups = new Map<number, { name: string; items: CartItem[] }>();
  for (const item of items) {
    const group = groups.get(item.categoryId) ?? { name: item.categoryName, items: [] };
    group.items.push(item);
    groups.set(item.categoryId, group);
  }

  if (isLoading) return <p>טוען קטלוג...</p>;
  if (isError)
    return (
      <div>
        <p role="alert">שגיאה בטעינת הקטלוג</p>
        <button onClick={() => refetch()}>נסה שוב</button>
      </div>
    );

  return (
    <div>
      <h1>רשימת קניות</h1>

      <div className="row">
        <label>
          קטגוריה
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setProductId("");
            }}
          >
            <option value="">בחר קטגוריה</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          מוצר
          <select value={productId} onChange={(e) => setProductId(e.target.value)} disabled={!category}>
            <option value="">בחר מוצר</option>
            {category?.products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <label>
          כמות
          <input
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>

        <button onClick={handleAdd} disabled={!canAdd}>הוסף לעגלה</button>
      </div>

      <h2>העגלה</h2>
      {items.length === 0 && <p>העגלה ריקה</p>}
      {[...groups.entries()].map(([id, group]) => (
        <section key={id}>
          <h3>{group.name}</h3>
          <ul>
            {group.items.map((i) => (
              <li key={i.productId}>
                {i.productName} × {i.quantity}{" "}
                <button onClick={() => dispatch(removeItem(i.productId))}>הסר</button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <button className="primary" onClick={onContinue} disabled={items.length === 0}>
        המשך להזמנה
      </button>
    </div>
  );
}
