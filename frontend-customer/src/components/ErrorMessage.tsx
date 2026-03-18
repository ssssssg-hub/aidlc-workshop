import styles from './ErrorMessage.module.css';

interface Props {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className={styles.container} role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className={styles.retryBtn} data-testid="error-retry-button" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  );
}
