import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const metadata: Metadata = {
  title: "ReelPorn - Premium Adult Content",
  description: "Watch premium adult content in high quality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
