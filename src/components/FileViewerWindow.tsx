import { useEffect, useRef } from "react";
import { Download, X } from "lucide-react";

type ViewerFile = {
    id: string;
    title: string;
    src: string;
    description: string;
};

type FileViewerWindowProps = {
    isOpen: boolean;
    file: ViewerFile | null;
    onClose: () => void;
};

const FileViewerWindow = ({ isOpen, file, onClose }: FileViewerWindowProps) => {
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!file) {
        return null;
    }

    return (
        <div className={`file-viewer-overlay${isOpen ? " is-open" : " is-closed"}`} aria-hidden={!isOpen}>
            <section className="file-viewer-window" ref={viewerRef} aria-label={file.title}>
                <header className="file-viewer-header">
                    <div>
                        <p className="file-viewer-kicker">PDF Viewer</p>
                        <h2>{file.title}</h2>
                        <p className="file-viewer-subtitle">{file.description}</p>
                    </div>

                    <div className="file-viewer-actions">
                        <a className="file-viewer-action" href={file.src} target="_blank" rel="noreferrer" aria-label={`Download ${file.title}`}>
                            <Download size={16} />
                        </a>
                        <button type="button" className="file-viewer-action" onClick={onClose} aria-label="Close viewer">
                            <X size={16} />
                        </button>
                    </div>
                </header>

                <div className="file-viewer-body">
                    <iframe title={file.title} src={file.src} className="file-viewer-frame" />
                </div>
            </section>
        </div>
    );
};

export default FileViewerWindow;