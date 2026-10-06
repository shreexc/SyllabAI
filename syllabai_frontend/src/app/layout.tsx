import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyllabAI — Make room for a brighter way to learn",
  description: "Thoughtful tools for teachers and students to make learning feel more human, curious, and their own.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" theme="light" richColors closeButton expand visibleToasts={4} duration={5000} />
      </body>
    </html>
  );
}
