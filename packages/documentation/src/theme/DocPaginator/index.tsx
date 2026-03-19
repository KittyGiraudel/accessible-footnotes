import type { WrapperProps } from "@docusaurus/types";
import type DocPaginatorType from "@theme/DocPaginator";
import DocPaginator from "@theme-original/DocPaginator";
import React, { type ReactNode } from "react";
import { Footnotes } from "react-a11y-footnotes";

type Props = WrapperProps<typeof DocPaginatorType>;

export default function DocPaginatorWrapper(props: Props): ReactNode {
  return (
    <>
      <div style={{ marginTop: "2rem" }}>
        <Footnotes />
      </div>
      <DocPaginator {...props} />
    </>
  );
}
