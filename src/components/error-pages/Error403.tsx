'use client';

import { Button, Result } from 'antd';
import Link from 'next/link';

export const Error403: React.FC = () => (
  <Result
    status="403"
    title="Permission denied"
    extra={
      <Link href="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
);
