import { useState } from "react";
import ShoppingList from "./components/ShoppingList";
import OrderForm from "./components/OrderForm";

type Screen = { name: "shop" } | { name: "order" } | { name: "done"; orderId: string };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "shop" });

  return (
    <main>
      {screen.name === "shop" && <ShoppingList onContinue={() => setScreen({ name: "order" })} />}
      {screen.name === "order" && (
        <OrderForm
          onBack={() => setScreen({ name: "shop" })}
          onDone={(orderId) => setScreen({ name: "done", orderId })}
        />
      )}
      {screen.name === "done" && (
        <div>
          <h1>ההזמנה התקבלה!</h1>
          <p>מספר הזמנה: <span dir="ltr">{screen.orderId}</span></p>
          <button className="primary" onClick={() => setScreen({ name: "shop" })}>הזמנה חדשה</button>
        </div>
      )}
    </main>
  );
}
