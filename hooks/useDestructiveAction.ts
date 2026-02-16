
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseDestructiveActionConfig<T> {
    title: string;
    message: (item: T) => React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    action: (item: T) => Promise<void>;
    successMessage?: string;
    errorMessage?: string;
}

interface DestructiveActionReturn<T> {
    trigger: (item: T) => void;
    modalProps: {
        isOpen: boolean;
        onClose: () => void;
        onConfirm: () => void;
        title: string;
        message: React.ReactNode;
        confirmText: string;
        cancelText: string;
        loading: boolean;
    };
    isDeleting: boolean;
}

/**
 * Hook modular para interceptar ações de exclusão com um modal de confirmação.
 * Gerencia estados de loading, feedback visual (Toast) e execução segura da promessa.
 */
export const useDestructiveAction = <T = string>({
    title,
    message,
    confirmText = 'Excluir',
    cancelText = 'Cancelar',
    action,
    successMessage = 'Item excluído com sucesso.',
    errorMessage = 'Erro ao excluir item.'
}: UseDestructiveActionConfig<T>): DestructiveActionReturn<T> => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [targetItem, setTargetItem] = useState<T | null>(null);

    // Inicia o fluxo de exclusão abrindo o modal e salvando o alvo
    const trigger = useCallback((item: T) => {
        setTargetItem(item);
        setIsOpen(true);
    }, []);

    const onClose = useCallback(() => {
        if (loading) return; // Previne fechar durante operação
        setIsOpen(false);
        // Pequeno delay para limpar o item apenas após a animação de saída do modal
        setTimeout(() => setTargetItem(null), 300);
    }, [loading]);

    // Executa a ação assíncrona
    const onConfirm = useCallback(async () => {
        if (!targetItem) return;

        setLoading(true);
        try {
            await action(targetItem);
            toast.success(successMessage);
            setIsOpen(false);
            setTargetItem(null);
        } catch (error) {
            console.error(error);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [targetItem, action, successMessage, errorMessage]);

    // Calcula a mensagem baseada no item atual (se houver)
    const currentMessage = targetItem ? message(targetItem) : null;

    return {
        trigger,
        isDeleting: loading,
        modalProps: {
            isOpen,
            onClose,
            onConfirm,
            title,
            message: currentMessage,
            confirmText,
            cancelText,
            loading
        }
    };
};
