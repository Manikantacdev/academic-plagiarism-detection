import React from 'react';

interface SourceItemProps {
    id: number;
    title: string;
    similarity: string;
    color: string;
    type?: string;
    active?: boolean;
    onClick: () => void;
}

export const SourceItem: React.FC<SourceItemProps> = ({
    id,
    title,
    similarity,
    color,
    type,
    active,
    onClick
}) => {
    // Safety check for color
    const safeColor = color || 'bg-muted';
    const textColorClass = safeColor.includes('orange')
        ? 'text-highlight-orange'
        : safeColor.includes('green')
            ? 'text-highlight-green'
            : safeColor.includes('purple')
                ? 'text-highlight-purple'
                : 'text-foreground';

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3 rounded-lg border flex items-start gap-3 transition-all mb-2
                ${active ? 'bg-muted border-primary/30 ring-1 ring-primary/20' : 'bg-transparent border-transparent hover:bg-muted/50'}
            `}
        >
            <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${safeColor}`} />
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate leading-tight">{title}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs font-mono font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground`}>
                        #{id}
                    </span>
                    {type && <span className="text-[10px] uppercase font-bold tracking-wide text-muted-foreground/80">{type}</span>}
                </div>
            </div>
            <div className="text-right">
                <span className={`text-sm font-bold ${textColorClass}`}>
                    {similarity}
                </span>
            </div>
        </button>
    );
};
