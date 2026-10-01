import type { FC } from "react";
import type { TextareaProps } from "../interfaces/props";

const Textarea: FC<TextareaProps> = ({ name, label, ...props }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
    >
      {label}
    </label>
    <div className="mt-2">
      <textarea
        id={name}
        name={name}
        {...props}
        className="focus:outline-primary block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
      />
    </div>
  </div>
);

export default Textarea;
