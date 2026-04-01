import styles from './Logo.module.css'

type LogoProps = {
  src: string
  size?: number | string
  alt?: string
}

export function Logo({
  src,
  size = 72,
  alt = 'Logo',
}: LogoProps) {
  const dimension = typeof size === 'number' ? `${size}px` : size

  return (
    <img
      className={styles.logo}
      src={src}
      alt={alt}
      style={{ width: dimension, height: dimension }}
    />
  )
}