import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  variant?: undefined;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  variant: "textarea";
}
