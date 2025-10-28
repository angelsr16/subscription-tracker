export const generateReminderSubject = (subscription, daysLeft) => {
    switch (daysLeft) {
        case 0:
            return `⚡ Final Reminder: ${subscription.name} Renews Today!`
        case 1:
            return `⚡ 1 Day Left!: ${subscription.name} Renews Tomorrow!`
        case 3:
            return `🚀 3 Days Left! ${subscription.name} Subscription Renewal`;
        case 5:
            return `⏳ ${subscription.name} Renews in 5 Days – Stay Subscribed!`
        case 7:
            return `📅 Reminder: Your ${subscription.name} Subscription Renews in 7 Days!`
    }
}