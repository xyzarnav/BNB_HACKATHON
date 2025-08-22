import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface RetryableTransactionOptions {
  maxRetries?: number;
  retryDelay?: number;
}

export const useRetryableTransaction = (options: RetryableTransactionOptions = {}) => {
  const { maxRetries = 3, retryDelay = 2000 } = options;
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const executeWithRetry = async <T>(
    transactionFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: unknown, attempt: number) => boolean // return true to retry, false to stop
  ): Promise<T | null> => {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        
        if (attempt > 1) {
          setIsRetrying(true);
          toast.loading(`Retrying transaction... (${attempt}/${maxRetries})`, {
            id: 'retry-transaction'
          });
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
        
        const result = await transactionFn();
        
        if (attempt > 1) {
          toast.dismiss('retry-transaction');
          setIsRetrying(false);
        }
        
        setRetryCount(0);
        onSuccess?.(result);
        return result;
        
      } catch (error) {
        lastError = error;
        console.error(`Transaction attempt ${attempt} failed:`, error);
        
        const shouldRetry = onError ? onError(error, attempt) : true;
        
        // Don't retry on user rejection or certain errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (
          errorMessage.includes("user rejected") || 
          errorMessage.includes("User denied") ||
          errorMessage.includes("execution reverted") ||
          !shouldRetry ||
          attempt === maxRetries
        ) {
          break;
        }
      }
    }
    
    // All retries failed
    if (isRetrying) {
      toast.dismiss('retry-transaction');
      setIsRetrying(false);
    }
    
    setRetryCount(0);
    throw lastError;
  };

  return {
    executeWithRetry,
    isRetrying,
    retryCount
  };
};
