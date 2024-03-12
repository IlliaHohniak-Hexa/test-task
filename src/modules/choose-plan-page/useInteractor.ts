import {useEffect, useState} from "react";
import {PAGE_LINKS} from "./types";
import {API} from "../../services/api";
import {PaymentPlanId} from "../../use-cases/get-subscription-products";
import {loadImageCover, loadPdfCover} from "./helpers";
import {ApiFile} from "../../services/api/types";
import {useUser} from "../../providers/user-provider";
import {NextRouter} from "next/router";

export const useInteractor = (router: NextRouter, setSelectedPlan: (value: PaymentPlanId) => void, abTests: Record<string, string>) => {
    const [file, setFile] = useState<ApiFile>();
    const [fileLink, setFileLink] = useState<string | null>(null);
    const [imagePDF, setImagePDF] = useState<Blob | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const { user } = useUser();

    useEffect(() => {
        if (user.subscription !== null) {
            router.push(`${PAGE_LINKS.DASHBOARD}`);
        }

        if (!user.email) {
            router.back();

            return;
        }

        if (router.query.token) {
            API.auth.byEmailToken(router.query.token as string);
        }
    }, [user.subscription, user.email, router.query?.token]);

    // @NOTE: analytics on page rendered
    useEffect(() => {
        if (!localStorage.getItem("select_plan_view")) {
            console.log("send event analytic3");
        }

        localStorage.setItem("select_plan_view", "true");

        return () => {
            localStorage.removeItem("select_plan_view");
        };
    }, []);

    useEffect(() => {
        API.files.getFiles().then((res) => {
            if (router.query?.file) {
                const chosenFile = res.files.find(
                    (item) => item.id === router.query!.file
                );

                setFile(chosenFile);

                return;
            }
            setFile(res.files[res.files.length - 1]);
        });
    }, []);

    // @NOTE: setting pre-select plan for users from remarketing emails
    useEffect(() => {
        if (router.query?.fromEmail === "true") {
            setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
            return;
        }
    }, [abTests]);

    useEffect(() => {
        loadPdfCover(file, setIsImageLoading, router, setImagePDF);
        loadImageCover(file, router, setFileLink);
    }, [loadImageCover, loadPdfCover]);

    return {
        file,
        fileLink,
        imagePDF,
        isImageLoading
    }
};
