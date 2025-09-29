// components/home/BallCollectionModal.tsx
import React, { useCallback } from 'react';
import BallCollectionScreen from '@/screens/BallCollection/BallCollectionScreen';
import { useBallCollectionStore } from '@/store/ballCollectionStore';

interface BallCollectionModalProps {
    visible: boolean;
    onClose: () => void;
}

const BallCollectionModal: React.FC<BallCollectionModalProps> = ({ visible, onClose }) => {
    const { stopCollection } = useBallCollectionStore();

    const handleStop = useCallback(() => {
        stopCollection();
        onClose();
    }, [stopCollection, onClose]);

    if (!visible) return null;

    return <BallCollectionScreen onStop={handleStop} onClose={onClose} />;
};

export default BallCollectionModal;