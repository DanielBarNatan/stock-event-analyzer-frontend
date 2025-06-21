// Type definitions for testing libraries
import '@testing-library/jest-dom';

declare module '@testing-library/react';
declare module '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
    }
  }
}
