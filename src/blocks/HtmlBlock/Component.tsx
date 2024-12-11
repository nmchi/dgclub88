import React from "react";
import type { HtmlBlock as HtmlBlockProps } from '@/payload-types'
import { cn } from "@/utilities/cn";

export const HtmlBlock: React.FC<HtmlBlockProps> = (props) => {
    const { html } = props;

    return (
        <div className={cn('container')} dangerouslySetInnerHTML={{ __html: html }} />
    )
}