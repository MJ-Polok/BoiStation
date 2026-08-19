type BrandLogoProps = {
    className?: string;
    variant?: 'full' | 'icon';
};

const logoPaths = {
    full: '/brand/boi-station-logo.svg',
    icon: '/brand/boi-station-icon.svg',
};

const BrandLogo = ({ className = '', variant = 'full' }: BrandLogoProps) => (
    <img
        alt="Boi Station"
        className={`block object-contain ${className}`}
        draggable={false}
        src={logoPaths[variant]}
    />
);

export default BrandLogo;
