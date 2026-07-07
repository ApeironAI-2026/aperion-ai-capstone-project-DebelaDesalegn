import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./FileUpload.css";
import {
    ACCEPTED_IMAGE_TYPES,
    SUPPORTED_FORMATS_LABEL,
} from "../../constants/images";

export default function FileUpload({
    multiple = false,
    maxFiles = 5,
    accept = ACCEPTED_IMAGE_TYPES,
    files = [],
    onChange,
    disabled = false,
}) {
    const inputId = useId();
    const inputRef = useRef(null);

    const [dragActive, setDragActive] = useState(false);

    // Normalize to an array
    const selectedFiles = useMemo(() => {
        if (multiple) {
            return Array.isArray(files) ? files : [];
        }

        return files ? [files] : [];
    }, [files, multiple]);

    // Image previews
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        const urls = selectedFiles
            .filter((file) => file?.type?.startsWith("image/"))
            .map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));

        setPreviews(urls);

        return () => {
            urls.forEach(({ url }) => URL.revokeObjectURL(url));
        };
    }, [selectedFiles]);

    const processFiles = (incomingFiles) => {
        if (!incomingFiles.length) return;

        if (!multiple) {
            onChange(incomingFiles[0]);
            return;
        }

        const merged = [...selectedFiles, ...incomingFiles];

        const unique = merged.filter(
            (file, index, self) =>
                index ===
                self.findIndex(
                    (f) =>
                        f.name === file.name &&
                        f.lastModified === file.lastModified
                )
        );

        onChange(unique.slice(0, maxFiles));
    };

    const handleFileChange = (event) => {
        const picked = Array.from(event.target.files || []);

        processFiles(picked);

        // Allow selecting the same file again
        event.target.value = "";
    };

    const removeFile = (fileToRemove) => {
        if (!multiple) {
            onChange(null);

            if (inputRef.current) {
                inputRef.current.value = "";
            }

            return;
        }

        const updated = selectedFiles.filter(
            (file) =>
                !(
                    file.name === fileToRemove.name &&
                    file.lastModified === fileToRemove.lastModified
                )
        );

        onChange(updated);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const clearAll = () => {
        onChange(multiple ? [] : null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const openPicker = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    const handleDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!disabled) {
            setDragActive(true);
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setDragActive(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setDragActive(false);

        if (disabled) return;

        const droppedFiles = Array.from(event.dataTransfer.files || []).filter(
            (file) => file.type.startsWith("image/")
        );

        processFiles(droppedFiles);
    };
        return (
        <div className="file-upload">
            <input
                id={inputId}
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={handleFileChange}
                className="file-upload-input"
            />

            <div
                className={`upload-zone ${dragActive ? "drag-active" : ""} ${
                    disabled ? "disabled" : ""
                }`}
                onClick={openPicker}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="upload-icon">☁️</div>

                <h3>
                    {multiple
                        ? "Upload Face Images"
                        : "Upload Face Image"}
                </h3>

                <p>
                    Drag &amp; Drop your image{multiple ? "s" : ""} here
                    <br />
                    <strong>or click to browse</strong>
                </p>

                <small>
                    {SUPPORTED_FORMATS_LABEL}
                    {multiple && ` • Maximum ${maxFiles} images`}
                </small>
            </div>

            {multiple && (
                <div className="upload-counter">
                    {selectedFiles.length} / {maxFiles} image
                    {maxFiles > 1 ? "s" : ""}
                </div>
            )}

            {selectedFiles.length > 0 && (
                <>
                    <div className="upload-toolbar">
                        <button
                            type="button"
                            className="clear-all-btn"
                            onClick={clearAll}
                            disabled={disabled}
                        >
                            Remove All
                        </button>
                    </div>

                    <div className="preview-grid">
                        {previews.map(({ file, url }) => (
                            <div
                                key={`${file.name}-${file.lastModified}`}
                                className="preview-card"
                            >
                                <img
                                    src={url}
                                    alt={file.name}
                                    className="preview-image"
                                />

                                <div className="preview-info">
                                    <div className="preview-name">
                                        {file.name}
                                    </div>

                                    <div className="preview-size">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(file);
                                    }}
                                    disabled={disabled}
                                    aria-label={`Remove ${file.name}`}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}