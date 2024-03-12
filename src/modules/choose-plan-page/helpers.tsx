import {API} from "../../services/api";
import {generatePDFCover} from "../../use-cases/generate-pdf-cover";
import {imagesFormat, InternalFileType} from "./types";
import check from "./assets/check.svg";
import cross from "./assets/cross.svg";
import React from "react";
import {PaymentPlanId, Product} from "../../use-cases/get-subscription-products";
import {NextRouter} from "next/router";
import {ApiFile} from "../../services/api/types";

const getFileUrl = async (router: NextRouter, file: ApiFile) => {
    if (router.query?.file) {
        const editUrl = await API.files
            // TODO: check types
            .editedFile(router.query.file as string);

        const downloadUrl = await API.files
            // TODO: check types
            .downloadFile(router.query.file as string);

        return router.query.editedFile === "true"
            ? editUrl.url
            : downloadUrl.url;
    }

    const downloadInfo = await API.files.downloadFile(file.id);

    return downloadInfo.url;
};

export const loadPdfCover = async (file: ApiFile, setIsImageLoading: (value: boolean) => void, router: NextRouter, setImagePDF: (value: Blob) => void) => {
    if (!file || file.internal_type !== "PDF") {
        return;
    }

    setIsImageLoading(true);

    const fileUrl = await getFileUrl(router, file);

    const pdfCover = await generatePDFCover({
        pdfFileUrl: fileUrl,
        width: 640,
    });
    console.log('pdfCover == ', pdfCover)

    setImagePDF(pdfCover);

    setIsImageLoading(false);
};

export const loadImageCover = async (file: ApiFile, router: NextRouter, setFileLink: (value: string) => void) => {
    if (
        !file ||
        !imagesFormat.includes(file.internal_type) ||
        // @NOTE: this two checks fir filename exists because sometimes OS do not pass file.type correctly
        !imagesFormat.includes(
            file.filename.slice(-3).toUpperCase() as InternalFileType
        ) ||
        !imagesFormat.includes(
            file.filename.slice(-4).toUpperCase() as InternalFileType
        )
    ) {
        return;
    }

    const fileUrl = await getFileUrl(router, file);

    setFileLink(fileUrl);
};

export const getTrialFormattedPrice = (price: number, currency: string) => {
    const priceFromCents = (price / 100).toFixed(2);
    const currencySign = getCurrency(currency);

    return `${currencySign}${priceFromCents}`;
};

export const getAnnualFormattedPrice = (price: number, currency: string) => {
    const priceFromCents = (price / 100 / 12).toFixed(2);
    const currencySign = getCurrency(currency);

    if (price === 19900) {
        return `€${priceFromCents}`;
    }

    return `${currencySign}${priceFromCents}`;
};

export const getCurrency = (currency: string) => {
    let currencySign: string;

    switch (currency) {
        case "USD":
            currencySign = "$";
            break;
        case "GBP":
            currencySign = "£";
            break;
        default:
            currencySign = "€";
            break;
    }

    return currencySign;
};

export const getBullets = (t: (key: string) => string, product: Product) => {
    let keyPart: string;

    switch (product.name) {
        case PaymentPlanId.MONTHLY_FULL:
            keyPart = 'monthly_full'
            break;
        case PaymentPlanId.ANNUAL:
            keyPart = 'annual'
            break;
        default:
            keyPart = 'monthly';
    }

    const bulletsLength = 8;

    const bulletsList = [];

    for (let i = 0; i < bulletsLength; i++) {
        const monthlyProduct = i > 2 && product.name === PaymentPlanId.MONTHLY;

        const bullet = {
            imgSrc: monthlyProduct ? cross : check,
            bullText: <span
                className={monthlyProduct ? "text-[#878787]" : undefined}>{t(`payment_page.plans.${keyPart}.bullet${i}`)}</span>,
        }

        bulletsList.push(bullet);
    }

    return bulletsList;
}
