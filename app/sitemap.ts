import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://osump.chooh.moe',
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
    ];
}