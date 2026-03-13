import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ConfirmModal({ isOpen, onClose, onConfirm, titulo, mensaje, confirmText = "Eliminar", cancelText = "Cancelar", variant = "destructive" }) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{titulo}</DialogTitle>
                    <DialogDescription>{mensaje}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button 
                        type="button" 
                        className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
