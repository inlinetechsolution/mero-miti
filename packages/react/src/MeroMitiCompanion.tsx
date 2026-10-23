import React, { useEffect, useRef } from 'react';
import { MeroMitiCompanionBridge, CompanionOptions } from '@mero-miti/web/companion-bridge';

export interface MeroMitiCompanionProps extends CompanionOptions {
  targetRef: React.RefObject<HTMLInputElement>;
}

export const MeroMitiCompanion: React.FC<MeroMitiCompanionProps> = ({
  targetRef,
  ...options
}) => {
  const bridgeRef = useRef<MeroMitiCompanionBridge | null>(null);

  useEffect(() => {
    if (targetRef.current && !bridgeRef.current) {
      bridgeRef.current = new MeroMitiCompanionBridge(targetRef.current, options);
    }

    return () => {
      if (bridgeRef.current) {
        bridgeRef.current.destroy();
        bridgeRef.current = null;
      }
    };
  }, [targetRef, options]);

  return null; // Mounts adjacent to targetRef natively in DOM
};
