import { ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  return <JotaiProvider>{children}</JotaiProvider>;
};
  