import {useRemoteConfig} from "../../providers/remote-config-provider";
import {
    PaymentPlanId, Product,
    useGetSubscriptionProducts,
} from "../../use-cases/get-subscription-products";
import {useRouter} from "next/router";
import {useState} from "react";
import {IPaymentPageInteractor, PAGE_LINKS, Plan} from "./types";
import {
    getAnnualFormattedPrice,
    getBullets,
    getCurrency,
    getTrialFormattedPrice,
} from "./helpers";
import {useInteractor} from "./useInteractor";

export const usePaymentPageInteractor = (): IPaymentPageInteractor => {
    const [selectedPlan, setSelectedPlan] = useState<PaymentPlanId>(
        PaymentPlanId.MONTHLY_FULL
    );

    const router = useRouter();
    const {products} = useGetSubscriptionProducts();
    const {abTests, isRemoteConfigLoading} = useRemoteConfig();
    const {file, fileLink, imagePDF, isImageLoading} = useInteractor(router, setSelectedPlan, abTests);

    const onCommentsFlip = () => {
        console.log("send event analytic0");
    };

    const onSelectPlan = (plan: PaymentPlanId) => {
        if (selectedPlan === plan) {
            setSelectedPlan(plan);
            onContinue("planTab");

            return;
        }
        setSelectedPlan(plan);
        const product = products.find((item) => item.name === plan);

        console.log(
            "send event analytic1",
            "productId: ",
            plan,
            "currency: ",
            product.price.currency || "USD",
            "value: ",
            (product.price.price || 0) / 100
        );
    };

    const onContinue = (place?: string) => {
        console.log(
            "send event analytic2",
            "place: ",
            place ? place : "button",
            "planName: ",
            selectedPlan
        );

        localStorage.setItem("selectedPlan", selectedPlan);

        router.push({pathname: `${PAGE_LINKS.PAYMENT}`, query: router.query});
    };

    const getPlans = (t: (key: string, variables?: Record<string, string>) => string): Plan[] => {
        const plansList = [];

        products.forEach((product: Product) => {
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

            const productPrice = product.price.price;
            const productCurrency = product.price.currency;

            const plan = {
                id: product.name,
                title: t(`payment_page.plans.${keyPart}.title`),
                price: product.name === PaymentPlanId.ANNUAL ? getAnnualFormattedPrice(
                    productPrice,
                    productCurrency
                ) : getTrialFormattedPrice(
                    product?.price.trial_price,
                    productCurrency
                ),
                ...(product.name !== PaymentPlanId.ANNUAL && {
                    fullPrice: getTrialFormattedPrice(
                        productPrice,
                        productCurrency
                    )
                }),
                formattedCurrency: getCurrency(productCurrency),
                date: null,
                bullets: getBullets(t, product),
                text: t(`payment_page.plans.${keyPart}.text`, {
                    formattedPrice: getTrialFormattedPrice(
                        productPrice,
                        productCurrency
                    ),
                }),
            }

            plansList.push(plan);
        })

        return plansList;
    };

    return {
        selectedPlan,
        onSelectPlan,
        onContinue,
        onCommentsFlip,

        imagePDF,
        isImageLoading,
        fileName: file ? file.filename : null,
        fileType: file ? file.internal_type : null,
        fileLink,
        isEditorFlow:
            (router.query?.source === "editor" ||
                router.query?.source === "account") &&
            router.query.convertedFrom === undefined,
        isSecondEmail: router.query?.fromEmail === "true",
        isThirdEmail: router.query?.fromEmail === "true",

        isRemoteConfigLoading,

        getPlans,
        isPlansLoading: products.length === 0,
    };
};
