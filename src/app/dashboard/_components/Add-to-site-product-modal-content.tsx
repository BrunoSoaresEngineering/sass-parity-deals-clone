'use client';

import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { env } from '@/data/env/client';
import { cn } from '@/lib/utils';
import { CopyCheckIcon, CopyIcon, CopyXIcon } from 'lucide-react';
import { useState } from 'react';

type CopyState = 'idle' | 'copied' | 'error';

function getCopyIcon(copyState: CopyState) {
  const copyIconMap = {
    idle: CopyIcon,
    copied: CopyCheckIcon,
    error: CopyXIcon,
  };

  return copyIconMap[copyState];
}

function getCopyIconText(copyState: CopyState) {
  const copyTextMap = {
    idle: 'Copy Code',
    copied: 'Copied!',
    error: 'Error!',
  };

  return copyTextMap[copyState];
}

function AddToSiteProductModalContent({ id } : { id :string }) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const Icon = getCopyIcon(copyState);
  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;

  async function copyCodeToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('error');
      setTimeout(() => setCopyState('idle'), 2000);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl">Start Earning PPP Sales</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your customers will start
          seeing PPP discounts!
        </DialogDescription>
      </DialogHeader>
      <pre
        className={cn(
          'mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground',
        )}
      >
        <code>{code}</code>
      </pre>

      <div className="flex gap-2">
        <Button onClick={() => copyCodeToClipboard()}>
          <Icon className="size-4 mr-2" />
          {getCopyIconText(copyState)}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}
export default AddToSiteProductModalContent;
