import PropTypes from 'prop-types';
import React from 'react';
type BaseProps = {
    id?: string;
    children: React.ReactNode;
};
type FootnoteRefProps = BaseProps & {
    description: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};
export interface FootnotesProviderProps {
    children: React.ReactNode;
    footnotesTitleId?: string;
}
export interface TitleProps extends React.HTMLAttributes<HTMLElement> {
    id: string;
}
export interface BackLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    'data-a11y-footnotes-back-link': true;
    href: string;
    'aria-label': string;
    role: 'doc-backlink';
}
export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    id: string;
    children: React.ReactNode;
}
type WrapperComponent = React.ElementType<React.HTMLAttributes<HTMLElement>>;
type TitleComponent = React.ElementType<TitleProps>;
type ListComponent = React.ElementType<React.HTMLAttributes<HTMLElement>>;
type ListItemComponent = React.ElementType<ListItemProps>;
type BackLinkComponent = React.ElementType<BackLinkProps>;
export interface FootnotesProps {
    Wrapper?: WrapperComponent;
    Title?: TitleComponent;
    List?: ListComponent;
    ListItem?: ListItemComponent;
    BackLink?: BackLinkComponent;
}
type TreeNode = React.ReactNode;
export declare const FootnoteRef: {
    (props: FootnoteRefProps): React.JSX.Element;
    propTypes: {
        description: PropTypes.Validator<NonNullable<PropTypes.ReactNodeLike>>;
        children: PropTypes.Validator<NonNullable<PropTypes.ReactNodeLike>>;
        id: PropTypes.Requireable<string>;
    };
};
export declare const Footnotes: ({ Wrapper, Title, List, ListItem, BackLink, }: FootnotesProps) => React.JSX.Element | null;
export declare const FootnotesProvider: ({ children, footnotesTitleId, }: FootnotesProviderProps) => React.JSX.Element;
export declare function getIdFromTree(tree: TreeNode): string;
export {};
