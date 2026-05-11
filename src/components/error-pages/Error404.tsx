'use client';

import { Button, Result } from 'antd';
import Link from 'next/link';

export const Error404: React.FC = () => (
  <Result
    status="404"
    title="Page not found"
    extra={
      <Link href="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
);
