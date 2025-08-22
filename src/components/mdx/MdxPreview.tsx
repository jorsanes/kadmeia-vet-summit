import { MemoryRouter } from "react-router-dom";

export function MdxPreview({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}