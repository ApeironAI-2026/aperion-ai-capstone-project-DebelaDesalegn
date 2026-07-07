import "./PageHeader.css";

export default function PageHeader({
    title,
    subtitle,
    icon = "📋",
}) {
    return (
        <div className="page-header">
            <div className="page-header-icon">
                {icon}
            </div>

            <div className="page-header-content">
                <h1>{title}</h1>

                {subtitle && (
                    <p>{subtitle}</p>
                )}
            </div>
        </div>
    );
}