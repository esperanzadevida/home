"use client";

import { useState, useEffect, useRef } from "react";
import { Edit2, Copy, Share2, Trash2, Eye } from "lucide-react";

interface ContextMenuOption {
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  destructive?: boolean;
}

interface ContextMenuWrapperProps {
  children: React.ReactNode;
  options?: ContextMenuOption[];
  onEdit?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
}

export function ContextMenuWrapper({
  children,
  options,
  onEdit,
  onCopy,
  onShare,
}: ContextMenuWrapperProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const defaultOptions: ContextMenuOption[] = [
    {
      label: "Ver Detalles",
      icon: <Eye className="w-4 h-4 text-primary" />,
      action: () => console.log("Ver"),
    },
    {
      label: "Copiar Enlace",
      icon: <Copy className="w-4 h-4 text-muted-foreground" />,
      action: () => onCopy?.(),
    },
    {
      label: "Editar Elemento",
      icon: <Edit2 className="w-4 h-4 text-accent" />,
      action: () => onEdit?.(),
    },
    {
      label: "Compartir",
      icon: <Share2 className="w-4 h-4 text-muted-foreground" />,
      action: () => onShare?.(),
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4 text-destructive" />,
      action: () => console.log("Eliminar"),
      destructive: true,
    },
  ];

  const menuOptions = options || defaultOptions;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", () => setVisible(false));
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div onContextMenu={handleContextMenu} className="relative">
      {children}

      {visible && (
        <div
          ref={menuRef}
          style={{ top: position.y, left: position.x }}
          className="fixed z-50 min-w-[180px] rounded-2xl bg-card border border-border shadow-2xl p-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
        >
          {menuOptions.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                opt.action();
                setVisible(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-left transition-colors ${
                opt.destructive
                  ? "text-destructive hover:bg-destructive/10"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
