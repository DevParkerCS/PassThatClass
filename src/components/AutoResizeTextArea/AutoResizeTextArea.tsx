import { useEffect, useRef } from "react";

type AutoResizeTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AutoResizeTextarea(props: AutoResizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    resize(); // resize on mount & when value changes externally
  }, [props.value]);

  return (
    <textarea
      {...props}
      ref={ref}
      onInput={(e) => {
        resize();
        props.onInput?.(e);
      }}
      style={{
        ...props.style,
        overflow: "hidden",
        resize: "none",
      }}
    />
  );
}
