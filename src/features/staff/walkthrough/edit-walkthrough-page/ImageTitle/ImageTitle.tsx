import styles from '../styles';

interface ImageTitleProps {
  title: string;
}

export const ImageTitle = ({ title }: ImageTitleProps) => <p class={styles.improvedImageSelectorImageTitle}>{title}</p>;
