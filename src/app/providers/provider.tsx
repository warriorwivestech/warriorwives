"use client";

import { PropsWithChildren } from "react";
import ReduxProvider from "./reduxProvider";

type ReduxProviderProps = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: PropsWithChildren<ReduxProviderProps>) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
