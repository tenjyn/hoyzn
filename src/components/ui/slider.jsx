import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, trackClassName, rangeClassName, thumbClassName, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center group", className)}
    {...props}
  >
    <SliderPrimitive.Track className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-secondary group-hover:bg-primary/20 transition-colors", trackClassName)}>
      <SliderPrimitive.Range className={cn("absolute h-full bg-primary group-hover:bg-primary/80 transition-colors", rangeClassName)} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:scale-110", 
        thumbClassName
      )} 
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
