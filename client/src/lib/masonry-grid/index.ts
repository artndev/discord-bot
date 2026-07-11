import ReactMasonry, { MasonryProps } from 'react-masonry-css';

export const Masonry = ReactMasonry as unknown as React.FC<React.PropsWithChildren<MasonryProps>>;

export const BREAKPOINT_COLUMNS = {
    default: 3,
    1100: 2,
    700: 1,
};
