export default function sitemap(){
    return [
        {
            url: process.env.NEXT_PUBLIC_BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/admin`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/payment`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/info`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/cart`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/orders`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.7
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/shirts`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/pants`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        },
        {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/accessories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        }
    
    ]
}