import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PostCreationModal({
    isOpen,
    onClose,
    onContinue,
    entityName,
    nextStepName,
    description
}) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) onClose();
        }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                        <Sparkles className="w-6 h-6 text-emerald-600" />
                    </div>
                    <DialogTitle className="text-xl">¡{entityName} Registrado!</DialogTitle>
                    <DialogDescription className="text-base">
                        {description || `El registro de ${entityName.toLowerCase()} fue exitoso.`}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-2 text-center text-zinc-600 text-sm">
                    ¿Te gustaría continuar al siguiente paso y <span className="font-medium text-zinc-900">{nextStepName.toLowerCase()}</span> ahora mismo?
                </div>

                <DialogFooter className="sm:justify-between gap-2 mt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-700 w-full sm:w-auto"
                    >
                        Tal vez más tarde
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            onClose();
                            onContinue();
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto group"
                    >
                        Sí, {nextStepName}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
