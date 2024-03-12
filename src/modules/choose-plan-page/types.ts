import {PaymentPlanId} from "../../use-cases/get-subscription-products";

export enum PAGE_LINKS {
    MAIN = "/",
    PAYMENT = "/payment",
    DASHBOARD = "/dashboard",
}

export enum InternalFileType {
    JPEG = "JPEG",
    JPG = "JPG",
    HEIC = "HEIC",
    PDF = "PDF",
    PNG = "PNG",
    BMP = "BMP",
    EPS = "EPS",
    GIF = "GIF",
    SVG = "SVG",
    TIFF = "TIFF",
    WEBP = "WEBP",
}

export const imagesFormat = [
    InternalFileType.HEIC,
    InternalFileType.SVG,
    InternalFileType.PNG,
    InternalFileType.BMP,
    InternalFileType.EPS,
    InternalFileType.GIF,
    InternalFileType.TIFF,
    InternalFileType.WEBP,
    InternalFileType.JPG,
    InternalFileType.JPEG,
];

export type Bullets = {
    imgSrc: string;
    bullText: JSX.Element;
};

export interface Plan {
    id: PaymentPlanId;
    title: string;
    price: string;
    date: string | null;
    bullets: Bullets[];
    bulletsC?: Bullets[];
    text: string | JSX.Element;
    formattedCurrency?: string;
    fullPrice?: string;
}

export interface IPaymentPageInteractor {
    selectedPlan: PaymentPlanId;
    onSelectPlan: (plan: PaymentPlanId) => void;
    onContinue: (place?: string) => void;
    onCommentsFlip: () => void;

    imagePDF: Blob | null;
    isImageLoading: boolean;
    fileType: string | null;
    fileLink: string | null;

    isEditorFlow: boolean;
    isSecondEmail: boolean;
    isThirdEmail: boolean;

    isRemoteConfigLoading: boolean;
    fileName: string | null;

    getPlans: (t: (key: string, variables?: Record<string, string>) => string) => Plan[];
    isPlansLoading: boolean;
}
