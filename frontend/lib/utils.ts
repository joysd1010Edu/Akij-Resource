/* ==========  frontend/lib/utils.ts  ===============*/
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* ==========  Function cn contains reusable module logic used by this feature.  ===============*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
