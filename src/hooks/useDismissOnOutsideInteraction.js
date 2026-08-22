import { useEffect } from "react";

const useDismissOnOutsideInteraction = (ref, onDismiss, isEnabled = true) => {
    useEffect(() => {
        if (!isEnabled) {
            return undefined;
        }

        const handleInteraction = (event) => {
            const element = ref.current;

            if (!element || element.contains(event.target)) {
                return;
            }

            onDismiss(event);
        };

        document.addEventListener("pointerdown", handleInteraction);

        return () => {
            document.removeEventListener("pointerdown", handleInteraction);
        };
    }, [ref, onDismiss, isEnabled]);
};

export default useDismissOnOutsideInteraction;
