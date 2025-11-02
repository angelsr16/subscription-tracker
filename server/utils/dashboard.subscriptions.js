const getMonthlyCost = (sub) => {
    switch (sub.frecuency) {
        case "daily":
            return sub.price * 30;
        case "weekly":
            return sub.price * 4.345;      // avg weeks per month
        case "monthly":
            return sub.price;
        case "yearly":
            return sub.price / 12;
        default:
            return 0;
    }
};

const getYearlyCost = (sub) => {
    switch (sub.frecuency) {
        case "daily":
            return sub.price * 365;
        case "weekly":
            return sub.price * 52;
        case "monthly":
            return sub.price * 12;
        case "yearly":
            return sub.price;
        default:
            return 0;
    }
};

export const getMonthlyRecurringCost = (subscriptions) => {
    return subscriptions
        .filter(s => s.status === "active")
        .reduce((sum, sub) => sum + getMonthlyCost(sub), 0);
}

export const getYearlyRecurringCost = (subscriptions) => {
    return subscriptions
        .filter(s => s.status === "active")
        .reduce((sum, sub) => sum + getYearlyCost(sub), 0);
}

export const getUpcomingRenewals = (subscriptions) => {
    const now = new Date();
    const next10 = new Date();
    next10.setDate(now.getDate() + 10);

    return subscriptions.filter(sub =>
        sub.status === "active" &&
        sub.renewalStatus === 'pending' &&
        sub.renewalDate &&
        sub.renewalDate >= now &&
        sub.renewalDate <= next10
    );
}

export const getPendingRenewals = (subscriptions) => {
    return subscriptions.filter(sub => sub.renewalStatus === 'pending' && sub.status === 'active')
}