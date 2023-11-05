import { getCoffee } from "@/app/data";
import React from "react";

export default async function EventsPage() {
  const coffee = await getCoffee();

  // console.log(coffee);

  return <div>events page</div>;
}
