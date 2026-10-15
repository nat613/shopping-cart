import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart } from "../store/cartSlice";
import { useCreateOrderMutation } from "../store/api";
import type { Customer } from "../store/types";

interface Props {
  onBack: () => void;
  onDone: (orderId: string) => void;
}

type Errors = Partial<Record<keyof Customer, string>>;

function validate(c: Customer): Errors {
  const errors: Errors = {};
  if (!c.fullName.trim()) errors.fullName = "שדה חובה";
  else if (c.fullName.trim().length > 100) errors.fullName = "עד 100 תווים";
  if (!c.address.trim()) errors.address = "שדה חובה";
  else if (c.address.trim().length > 200) errors.address = "עד 200 תווים";
  if (!c.email.trim()) errors.email = "שדה חובה";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim()) || c.email.trim().length > 254)
    errors.email = "כתובת אימייל לא תקינה";
  return errors;
}

export default function OrderForm({ onBack, onDone }: Props) {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [customer, setCustomer] = useState<Customer>({ fullName: "", address: "", email: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");

  const setField = (field: keyof Customer, value: string) =>
    setCustomer((c) => ({ ...c, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    const found = validate(customer);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    try {
      const trimmed = {
        fullName: customer.fullName.trim(),
        address: customer.address.trim(),
        email: customer.email.trim(),
      };
      const result = await createOrder({ customer: trimmed, items }).unwrap();
      dispatch(clearCart());
      onDone(result.orderId);
    } catch (err) {
      const data = (err as { data?: { errors?: { field: string; message: string }[] } }).data;
      if (data?.errors) {
        const serverErrors: Errors = {};
        for (const { field, message } of data.errors) {
          const key = field.replace("customer.", "") as keyof Customer;
          if (key in customer) serverErrors[key] = message;
        }
        setErrors(serverErrors);
      }
      setSubmitError("לא ניתן לשלוח את ההזמנה, נסו שוב");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1>פרטי הזמנה</h1>

      <label>
        שם מלא
        <input value={customer.fullName} onChange={(e) => setField("fullName", e.target.value)} />
        {errors.fullName && <span className="error">{errors.fullName}</span>}
      </label>

      <label>
        כתובת מלאה
        <input value={customer.address} onChange={(e) => setField("address", e.target.value)} />
        {errors.address && <span className="error">{errors.address}</span>}
      </label>

      <label>
        אימייל
        <input type="email" dir="ltr" value={customer.email} onChange={(e) => setField("email", e.target.value)} />
        {errors.email && <span className="error">{errors.email}</span>}
      </label>

      <h2>המוצרים שנבחרו</h2>
      <ul>
        {items.map((i) => (
          <li key={i.productId}>
            {i.categoryName}: {i.productName} × {i.quantity}
          </li>
        ))}
      </ul>

      {submitError && <p role="alert" className="error">{submitError}</p>}

      <button type="button" onClick={onBack}>חזרה</button>{" "}
      <button type="submit" className="primary" disabled={isLoading}>
        {isLoading ? "שולח..." : "אשר הזמנה"}
      </button>
    </form>
  );
}
