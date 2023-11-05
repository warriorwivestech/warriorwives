import { getWine } from "@/app/data";
import React from "react";

export default async function SingleEventPage() {
  const wine = await getWine();
    
  console.log(wine)

  return <div>single events page</div>;
}
