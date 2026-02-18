import * as React from "react"

import { cn } from "@/lib/utils"

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 md:px-6 pb-24 max-w-3xl md:max-w-4xl xl:max-w-5xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default PageContainer
