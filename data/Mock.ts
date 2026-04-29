export const DASHBOARD_DATA = {
    user: { name: 'Александр', isPremium: true },
    savings: {
        total: '15 450 ₽',
        items: [
            { label: 'Black', value: '5 000 ₽' },
            { label: 'All Airlines', value: '8 000' },
            { label: 'Bravo', value: '2 450' },
        ]
    },
    aiInsight: "В этом месяце вы можете сэкономить еще 2 000 ₽, если выберете категорию Супермаркеты.",
    programs: [
        { id: '1', title: 'Black', value: '5 000 ₽', sub: 'Кешбэк 5%', color: ['#1a1a1a', '#333'] },
        { id: '2', title: 'Platinum', value: '2 450', sub: 'баллов', color: ['#757F9A', '#D7DDE8'] },
        { id: '3', title: 'All Airlines', value: '8 000', sub: 'миль', color: ['#2193b0', '#6dd5ed'] },
    ],
    partners: [
        { name: 'Petshop', cashback: '+10%', icon: 'Dog' },
        { name: 'Electronics', cashback: '+10%', icon: 'Cpu' },
        { name: 'Travel', cashback: '+15%', icon: 'Plane' },
        { name: 'Grocery', cashback: '+8%', icon: 'ShoppingCart' },
    ]
};
