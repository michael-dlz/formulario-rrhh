import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  ItemGroup                                 */
/* -------------------------------------------------------------------------- */

const itemGroupVariants = cva("w-full", {
  variants: {
    variant: {
      default: "space-y-3",
      stack: "space-y-2",
      "grid-2": "grid grid-cols-1 md:grid-cols-2 gap-3",
      "grid-3": "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3",
      "grid-4": "grid grid-cols-2 md:grid-cols-4 gap-3",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ItemGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemGroupVariants> {
  asChild?: boolean;
}

const ItemGroup = React.forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(itemGroupVariants({ variant, className }))}
        {...props}
      />
    );
  }
);
ItemGroup.displayName = "ItemGroup";

/* -------------------------------------------------------------------------- */
/*                                    Item                                    */
/* -------------------------------------------------------------------------- */

const itemVariants = cva(
  "flex items-center justify-between rounded-lg border text-card-foreground transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-card shadow-sm",
        outline: "border-border/60 bg-transparent",
        muted: "border-transparent bg-muted/40",
      },
      size: {
        default: "p-4 gap-4",
        sm: "p-3 gap-3 text-sm",
        xs: "p-2.5 gap-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {
  asChild?: boolean;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(itemVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Item.displayName = "Item";

/* -------------------------------------------------------------------------- */
/*                                  ItemMedia                                 */
/* -------------------------------------------------------------------------- */

const itemMediaVariants = cva("flex shrink-0 items-center justify-center", {
  variants: {
    variant: {
      default: "rounded-md bg-muted text-muted-foreground",
      icon: "rounded-md bg-accent text-accent-foreground",
      avatar: "rounded-full overflow-hidden border",
      image: "rounded-md overflow-hidden object-cover",
    },
    size: {
      default: "h-10 w-10",
      sm: "h-8 w-8",
      xs: "h-6 w-6 text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ItemMediaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemMediaVariants> {
  asChild?: boolean;
}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(itemMediaVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
ItemMedia.displayName = "ItemMedia";

/* -------------------------------------------------------------------------- */
/*                                 ItemContent                                */
/* -------------------------------------------------------------------------- */

const ItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 min-w-0 space-y-0.5", className)}
    {...props}
  />
));
ItemContent.displayName = "ItemContent";

/* -------------------------------------------------------------------------- */
/*                                  ItemTitle                                 */
/* -------------------------------------------------------------------------- */

const ItemTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-sm font-semibold leading-none tracking-tight truncate", className)}
    {...props}
  />
));
ItemTitle.displayName = "ItemTitle";

/* -------------------------------------------------------------------------- */
/*                                  ItemLabel                                 */
/* -------------------------------------------------------------------------- */

const ItemLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs text-muted-foreground block font-medium", className)}
    {...props}
  />
));
ItemLabel.displayName = "ItemLabel";

/* -------------------------------------------------------------------------- */
/*                                  ItemValue                                 */
/* -------------------------------------------------------------------------- */

const ItemValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs font-semibold text-foreground truncate block", className)}
    {...props}
  />
));
ItemValue.displayName = "ItemValue";

/* -------------------------------------------------------------------------- */
/*                               ItemDescription                              */
/* -------------------------------------------------------------------------- */

const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground truncate", className)}
    {...props}
  />
));
ItemDescription.displayName = "ItemDescription";

/* -------------------------------------------------------------------------- */
/*                                 ItemActions                                */
/* -------------------------------------------------------------------------- */

const ItemActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-2 shrink-0", className)}
    {...props}
  />
));
ItemActions.displayName = "ItemActions";

export {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemLabel,
  ItemValue,
  ItemDescription,
  ItemActions,
};
