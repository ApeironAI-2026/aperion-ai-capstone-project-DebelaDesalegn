import { useEffect, useId, useRef, useState } from "react";
import { ACCEPTED_IMAGE_TYPES, SUPPORTED_FORMATS_LABEL } from "../constants/images";

export default function FileUpload({
    label = "Choose photo",
    multiple = false,
    maxFiles = 5,
    accept = ACCEPTED_IMAGE_TYPES,
    files = [],
    onChange,
    disabled = false,
}) {
    const inputId = useId();
    const inputRef = useRef(null);
    const [previewUrls, setPreviewUrls] = useState([]);

    const selected = multiple ? files : files[0] ? [files[0]] : [];

    useEffect(() => {
        const imageFiles = (multiple ? files : files[0] ? [files[0]] : []).filter(
            (file) => file?.type?.startsWith("image/")
        );
        const urls = imageFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [files, multiple]);

    const handleChange = (event) => {
        const picked = Array.from(event.target.files || []);
        if (multiple) {
            onChange(picked.slice(0, maxFiles));
        } else {
            onChange(picked[0] || null);
        }
    };

    const clearFiles = () => {
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

    return (
        <div className="file-upload">
            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
                disabled={disabled}
                className="file-upload-input"
            />

            <div className="file-upload-actions">
                <button
                    type="button"
                    className="file-upload-button"
                    onClick={openPicker}
                    disabled={disabled}
                >
                    {label}
                </button>

                {selected.length > 0 && (
                    <button
                        type="button"
                        className="file-upload-clear"
                        onClick={clearFiles}
                        disabled={disabled}
                    >
                        Clear
                    </button>
                )}
            </div>

            {selected.length === 0 ? (
                <p className="file-upload-hint">
                    {multiple
                        ? `Select up to ${maxFiles} photos (${SUPPORTED_FORMATS_LABEL})`
                        : `Select one photo (${SUPPORTED_FORMATS_LABEL})`}
                </p>
            ) : (
                <ul className="file-upload-list">
                    {selected.map((file) => (
                        <li key={`${file.name}-${file.lastModified}`}>
                            <span>{file.name}</span>
                            <span className="file-upload-size">
                                {(file.size / 1024).toFixed(0)} KB
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {previewUrls.length > 0 && (
                <div className="file-upload-previews">
                    {previewUrls.map((url, index) => (
                        <img
                            key={url}
                            src={url}
                            alt={selected[index]?.name || "Preview"}
                            className="file-upload-preview"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
