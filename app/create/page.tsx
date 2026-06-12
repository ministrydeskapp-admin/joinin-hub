"use client";

import { createSignupSheet } from "./actions";
import { useState } from "react";

type SignupItem = {
  id: number;
  name: string;
  quantity: number;
};

export default function CreatePage() {
  const [items, setItems] = useState<SignupItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);

  function addItem() {
    if (!itemName.trim()) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        name: itemName.trim(),
        quantity,
      },
    ]);

    setItemName("");
    setQuantity(1);
  }

  function removeItem(id: number) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Create a Signup Sheet</h1>

      <p className="mb-6 text-gray-600">
        Add your event details and the items people can sign up for.
      </p>

      <form action={createSignupSheet} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <input
            type="text"
            name="title"
            placeholder="Church Potluck"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Bring food, drinks, paper goods, or anything needed for the event."
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Fellowship Hall"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <hr className="my-6" />

        <h2 className="text-2xl font-semibold">Signup Items</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Item Needed</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Bread, Chips, Drinks"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">How Many?</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="border px-4 py-2 rounded-lg"
        >
          Add Item
        </button>

        {items.length > 0 && (
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">Items Added</h3>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {item.name} — {item.quantity} needed
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Create Signup Sheet
        </button>
      </form>
    </main>
  );
}