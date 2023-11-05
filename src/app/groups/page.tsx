"use client";

import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks/hooks";
import { userState } from "../redux/slices/userSlice";

export default function GroupPage() {
  const user = useAppSelector(userState);

  return <div>{user.name}</div>;
}
