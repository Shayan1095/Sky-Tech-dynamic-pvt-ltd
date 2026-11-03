import Markdown from "react-markdown";

/* The post itself.

   react-markdown rather than dangerouslySetInnerHTML: it builds React
   elements from the markdown and never parses raw HTML unless a plugin is
   added to let it, so a stray <script> in a post file is text, not a script.
   That matters more than usual here, because the posts are files anyone with
   repository access can add.

   Every element is given the site's own typography. Left to the browser's
   defaults a post would be the one page on the site set in Times New Roman
   with blue underlined links. */
const components = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      {...props}
      className="mt-14 scroll-mt-28 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-text [text-wrap:balance] sm:text-[1.9rem]"
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      {...props}
      className="mt-10 scroll-mt-28 font-display text-[1.2rem] font-semibold leading-snug tracking-[-0.015em] text-text [text-wrap:balance] sm:text-[1.35rem]"
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p {...props} className="mt-5 text-[1.02rem] leading-[1.75] text-text/80 [text-wrap:pretty]" />
  ),
  ul: (props: React.ComponentProps<"ul">) => <ul {...props} className="mt-5 flex flex-col gap-2.5" />,
  ol: (props: React.ComponentProps<"ol">) => (
    <ol {...props} className="mt-5 flex list-decimal flex-col gap-2.5 pl-5 marker:font-mono marker:text-primary" />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li {...props} className="text-[1.02rem] leading-[1.7] text-text/80 [text-wrap:pretty]" />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      {...props}
      className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors duration-300 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong {...props} className="font-semibold text-text" />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      {...props}
      className="mt-7 border-l-2 border-cta pl-5 font-display text-[1.15rem] font-medium leading-snug tracking-[-0.01em] text-text [text-wrap:pretty]"
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      {...props}
      className="rounded bg-[color-mix(in_srgb,var(--color-navy)_7%,var(--color-bg))] px-1.5 py-0.5 font-mono text-[0.88em] text-text"
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <hr {...props} className="mt-12 border-t border-dotted border-text/20" />
  ),
  /* A bullet list's own markers, in the site's drafting vocabulary. Applied
     here rather than with list-style so the diamond lines up with the first
     line of text at any size. */
  img: (props: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      loading="lazy"
      decoding="async"
      className="mt-8 w-full rounded-[14px] border border-text/[0.12]"
    />
  ),
};

export default function PostBody({ children }: { children: string }) {
  return (
    <div className="[&>*:first-child]:mt-0 [&_ul>li]:relative [&_ul>li]:pl-5 [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.6em] [&_ul>li]:before:h-[5px] [&_ul>li]:before:w-[5px] [&_ul>li]:before:rotate-45 [&_ul>li]:before:bg-cta [&_ul>li]:before:content-['']">
      <Markdown components={components}>{children}</Markdown>
    </div>
  );
}
